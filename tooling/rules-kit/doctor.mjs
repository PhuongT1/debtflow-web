import { access } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { syncWorkflows } from './workflows.mjs';
import { syncToolkit } from './setup.mjs';

// Read-only: never installs tools, starts a server or repairs local output.
export async function diagnoseToolkit(root) {
  root = resolve(root);
  const errors = [];
  const clients = [];
  if (Number(process.versions.node.split('.')[0]) < 20) errors.push('Node.js 20+ is required.');
  for (const path of ['AGENTS.md', '.ai-rules/project/README.md']) {
    try {
      await access(resolve(root, path));
    } catch {
      errors.push(`Missing project entry: ${path}`);
    }
  }
  try {
    await syncWorkflows(root, { check: true });
    const result = await syncToolkit(root, { check: true });
    for (const id of result.targets) {
      const client = result.clients[id];
      clients.push({
        id,
        label: client.label,
        entry: client.entry,
        skills: client.skillRoot ?? null,
      });
      const entry = resolve(root, client.entry);
      if (!entry.startsWith(root + sep)) {
        errors.push(`Client entry is outside the repository: ${id}`);
        continue;
      }
      try {
        await access(entry);
      } catch {
        errors.push(`Missing ${client.label} entry: ${client.entry}`);
      }
    }
  } catch (error) {
    errors.push(error.message);
  }
  return { ok: errors.length === 0, clients, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 2) throw new Error('Usage: node tooling/rules-kit/doctor.mjs');
  const result = await diagnoseToolkit(resolve(dirname(fileURLToPath(import.meta.url)), '../..'));
  process.stdout.write(`AI setup: ${result.ok ? 'PASS' : 'NEEDS ATTENTION'}\n`);
  for (const client of result.clients)
    process.stdout.write(
      `${client.label}: ${client.entry}; skills: ${client.skills ?? 'instruction adapter only'}\n`,
    );
  for (const error of result.errors) process.stdout.write(`- ${error}\n`);
  process.stdout.write(
    'Checks repository files only, not AI login, permissions or active-session discovery.\n' +
      (result.ok
        ? 'Reload the client and run the plan-only discovery check in Client Setup.\n'
        : 'Run rules:setup (or the exported synchronization commands) for stale/missing output; preserve modified files and resolve reported conflicts first.\n'),
  );
  process.exitCode = result.ok ? 0 : 1;
}
