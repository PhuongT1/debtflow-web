import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { fixtureServer } from './serve.mjs';
import { checkScenario } from './check.mjs';
import { checkBrowserScenario } from './check-browser.mjs';
import { scenarioById } from './catalog.mjs';

export async function runCodexScenario({
  receiptPath,
  output,
  model,
  playwrightCli,
  timeoutMs = 180000,
}) {
  if (!model) throw new Error('An explicit model is required for reproducible trials');
  const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  const scenario = scenarioById(receipt.id);
  output = resolve(output);
  const fixture = resolve(receipt.fixture);
  if (output === fixture || output.startsWith(fixture + sep))
    throw new Error('Keep evaluator output outside the agent workspace');
  await mkdir(output); // Refuse overwriting a previous run.
  const before = await checkScenario(receiptPath);
  const args = [
    'exec',
    '--ignore-user-config',
    '--ephemeral',
    '--json',
    '--skip-git-repo-check',
    '--sandbox',
    'workspace-write',
    '-m',
    model,
    '-c',
    'model_reasoning_effort="medium"',
    '-C',
    fixture,
  ];
  let server;
  let browser;
  let browserBefore = null;
  let browserAfter = null;
  try {
    if (scenario.fixture === 'ui' && playwrightCli) {
      const profile = await readFile(join(fixture, '.ai-rules/project/README.md'), 'utf8');
      const url = profile.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
      if (!url) throw new Error('UI fixture profile has no local URL');
      server = fixtureServer(fixture);
      await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(Number(new URL(url).port), '127.0.0.1', resolve);
      });
      const { chromium } = createRequire(pathToFileURL(resolve(playwrightCli)))('playwright');
      browser = await chromium.launch({ channel: 'chrome', headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      await page.screenshot({ path: join(output, 'before.png'), fullPage: true });
      if (scenario.allowedFiles.length) {
        try {
          browserBefore = await checkBrowserScenario(page, receipt.id, url);
        } catch (error) {
          browserBefore = { failed: error.message };
        }
      }
      const mcpArgs = [
        resolve(playwrightCli),
        '--headless',
        '--isolated',
        '--browser',
        'chrome',
        '--output-dir',
        join(fixture, '.evaluation-artifacts'),
      ];
      args.push(
        '-c',
        `mcp_servers.playwright.command=${JSON.stringify(process.execPath)}`,
        '-c',
        `mcp_servers.playwright.args=${JSON.stringify(mcpArgs)}`,
      );
    }
    args.push('-');
    let events = '';
    let stderr = '';
    let timedOut = false;
    const start = performance.now();
    const exitCode = await new Promise((resolve, reject) => {
      const child = spawn('codex', args, { cwd: fixture, stdio: ['pipe', 'pipe', 'pipe'] });
      let killTimer;
      const timer = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
        killTimer = setTimeout(() => child.kill('SIGKILL'), 5000);
      }, timeoutMs);
      child.stdout.on('data', (data) => {
        events += data;
      });
      child.stderr.on('data', (data) => {
        stderr += data;
      });
      child.once('error', (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.once('close', (code) => {
        clearTimeout(timer);
        clearTimeout(killTimer);
        resolve(code);
      });
      child.stdin.end(receipt.prompt);
    });
    const durationSeconds = Math.round((performance.now() - start) / 10) / 100;
    await writeFile(join(output, 'events.jsonl'), events);
    await writeFile(join(output, 'stderr.txt'), stderr);
    const parsed = events
      .split('\n')
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch {
          return [];
        }
      });
    const usage = parsed.filter((event) => event.type === 'turn.completed').at(-1)?.usage ?? null;
    const messages = parsed.filter(
      (event) => event.type === 'item.completed' && event.item?.type === 'agent_message',
    );
    const finalResponse = messages.at(-1)?.item.text ?? null;
    const after = await checkScenario(receiptPath);
    if (browser && scenario.allowedFiles.length) {
      try {
        browserAfter = await checkBrowserScenario(
          await browser.newPage(),
          receipt.id,
          `http://127.0.0.1:${server.address().port}/`,
          join(output, 'screenshots'),
        );
      } catch (error) {
        browserAfter = { failed: error.message };
      }
    }
    const result = {
      id: receipt.id,
      model,
      reasoning: 'medium',
      prompt: receipt.prompt,
      exitCode,
      timedOut,
      durationSeconds,
      usage,
      before,
      after,
      browserBefore,
      browserAfter,
      finalResponse,
      accepted: null,
    };
    await writeFile(join(output, 'result.json'), JSON.stringify(result, null, 2));
    return { output, ...result };
  } finally {
    await browser?.close();
    if (server?.listening) {
      server.closeAllConnections();
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = {};
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 2) {
    const field = {
      '--receipt': 'receiptPath',
      '--out': 'output',
      '--model': 'model',
      '--playwright-cli': 'playwrightCli',
    }[args[index]];
    if (!field || !args[index + 1])
      throw new Error(
        'Usage: run-codex.mjs --receipt file --out new-directory --model name [--playwright-cli path]',
      );
    options[field] = args[index + 1];
  }
  if (!options.receiptPath || !options.output) throw new Error('Receipt and output are required');
  console.log(JSON.stringify(await runCodexScenario(options), null, 2));
}
