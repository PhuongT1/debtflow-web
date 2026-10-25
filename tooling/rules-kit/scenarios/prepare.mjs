import { cp, mkdir, writeFile, readdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { exportRules } from '../export.mjs';
import { scenarioById } from './catalog.mjs';
import { snapshot } from './scope.mjs';

const directory = dirname(fileURLToPath(import.meta.url));
export async function prepareScenario(id, destination, { port = 4321 } = {}) {
  const scenario = scenarioById(id);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
  const fixture = await exportRules(destination); // Refuses an existing destination.
  const source = join(directory, 'fixtures', scenario.fixture);
  for (const name of await readdir(source))
    await cp(join(source, name), join(fixture, name), {
      recursive: true,
      force: false,
      errorOnExist: true,
    });
  await writeFile(
    join(fixture, 'src/unrelated.mjs'),
    "// Existing user work; unrelated to the task.\nexport const localPreference = 'preserve-this-value';\n",
  );
  const browser = scenario.fixture === 'ui';
  if (browser) {
    await mkdir(join(fixture, 'support'));
    await cp(join(directory, 'serve.mjs'), join(fixture, 'support/serve.mjs'));
  }
  const commands = browser
    ? `Start the static fixture with: node support/serve.mjs --port ${port}. Reuse it if already running. Browser route: http://127.0.0.1:${port}/. Browser tools depend on the trial runner; report unavailable access honestly.`
    : 'Existing tests: node --test src/*.test.mjs. For shared-default there is no test runner; inspect the exported default and consumer directly.';
  await writeFile(
    join(fixture, '.ai-rules/project/README.md'),
    `# Scenario Project Profile\n\nIsolated JavaScript/HTML/CSS fixture. Node.js 20+; no framework, dependencies or package installation. Source: src/. No Git repository; the evaluator records file snapshots instead. Preserve existing src/unrelated.mjs user work.\n\n${commands}\n\nFor shared-default, src/dialog.mjs is a public API with unavailable external consumers; src/consumer.mjs is only the known local consumer. Do not assume external compatibility. Verification artifacts may use .evaluation-artifacts/ or .playwright-mcp/; do not put production code there.\n`,
  );
  const receipt = resolve(fixture + '.baseline.json');
  await writeFile(
    receipt,
    JSON.stringify(
      { id, fixture, before: await snapshot(fixture), prompt: scenario.prompt },
      null,
      2,
    ),
    { flag: 'wx' },
  );
  return {
    id,
    fixture,
    receipt,
    prompt: scenario.prompt,
    workflow: scenario.workflow,
    browserUrl: browser ? `http://127.0.0.1:${port}/` : null,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [id, destination] = process.argv.slice(2);
  if (!id || !destination || process.argv.length !== 4)
    throw new Error('Usage: prepare.mjs <case-id> <new-directory>');
  console.log(JSON.stringify(await prepareScenario(id, destination), null, 2));
}
