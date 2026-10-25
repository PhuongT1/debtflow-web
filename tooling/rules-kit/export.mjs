import { mkdir, readdir, readFile, writeFile, lstat } from 'node:fs/promises';
import { dirname, resolve, join, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assets } from '../rules-viewer/assets.mjs';
import { syncWorkflows } from './workflows.mjs';
import { syncToolkit } from './setup.mjs';

const directory = dirname(fileURLToPath(import.meta.url));
const source = resolve(directory, '../../.ai-rules');

async function copyMarkdown(input, output) {
  await mkdir(output, { recursive: true });
  for (const entry of await readdir(input, { withFileTypes: true })) {
    const from = join(input, entry.name);
    const to = join(output, entry.name);
    if (entry.isDirectory()) await copyMarkdown(from, to);
    else if (entry.isFile() && entry.name.endsWith('.md'))
      await writeFile(to, await readFile(from), { flag: 'wx' });
    else throw new Error(`Unexpected rule source: ${from}`);
  }
}

export async function exportRules(destination, { withViewer = false } = {}) {
  const output = resolve(destination);
  // Export to a new directory only. Never replace a project's existing files.
  try {
    await lstat(output);
    throw new Error('Export destination already exists; choose a new directory.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (output === source || output.startsWith(source + sep))
    throw new Error('Cannot export into the rule source.');
  await mkdir(output);
  const ruleRoot = join(output, '.ai-rules');
  await mkdir(ruleRoot);
  await writeFile(join(ruleRoot, 'README.md'), await readFile(join(source, 'README.md')), {
    flag: 'wx',
  });
  await writeFile(join(ruleRoot, 'clients.json'), await readFile(join(source, 'clients.json')), {
    flag: 'wx',
  });
  await copyMarkdown(join(source, 'core'), join(ruleRoot, 'core'));
  await mkdir(join(ruleRoot, 'project'));
  for (const [template, target] of [
    ['project-profile.md', '.ai-rules/project/README.md'],
    ['AGENTS.md', 'AGENTS.md'],
    ['README.md', 'README.md'],
  ])
    await writeFile(join(output, target), await readFile(join(directory, 'templates', template)), {
      flag: 'wx',
    });
  const tools = join(output, 'tooling/rules-kit');
  await mkdir(tools, { recursive: true });
  for (const file of ['workflows.mjs', 'setup.mjs', 'clients.mjs'])
    await writeFile(join(tools, file), await readFile(join(directory, file)), { flag: 'wx' });
  await syncWorkflows(output);
  await syncToolkit(output);
  if (withViewer) {
    const viewer = join(output, 'tooling/rules-viewer');
    const files = new Set([...assets.values()].map(([file]) => file));
    for (const file of [
      'server.mjs',
      'library.mjs',
      'diagram.mjs',
      'build.mjs',
      'preview.mjs',
      'assets.mjs',
    ])
      files.add(file);
    for (const file of files) {
      if (file === 'site.config.mjs') continue;
      await mkdir(dirname(join(viewer, file)), { recursive: true });
      await writeFile(
        join(viewer, file),
        await readFile(join(directory, '../rules-viewer', file)),
        { flag: 'wx' },
      );
    }
    await writeFile(
      join(viewer, 'site.config.mjs'),
      await readFile(join(directory, 'templates/viewer.config.mjs')),
    );
    await writeFile(
      join(viewer, 'README.md'),
      await readFile(join(directory, 'templates/viewer-README.md')),
    );
  }
  return output;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (
    args[0] !== '--output' ||
    !args[1] ||
    args.length > 3 ||
    (args[2] && args[2] !== '--with-viewer')
  )
    throw new Error(
      'Usage: node tooling/rules-kit/export.mjs --output <new-directory> [--with-viewer]',
    );
  process.stdout.write(
    `Rule kit exported to ${await exportRules(args[1], { withViewer: args[2] === '--with-viewer' })}\n`,
  );
}
