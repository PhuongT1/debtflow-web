import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const start = '<!-- workflow-selector:start -->';
const end = '<!-- workflow-selector:end -->';

// Markdown remains the source for both humans and agents; no library dependency.
export async function discoverWorkflows(root) {
  const entries = [];
  async function walk(directory, relative = '') {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, item.name);
      const name = [relative, item.name].filter(Boolean).join('/');
      if (item.isSymbolicLink()) throw new Error(`Workflow symlinks are not supported: ${name}`);
      if (item.isDirectory()) await walk(path, name);
      else if (item.isFile() && item.name === 'README.md' && relative) {
        const text = (await readFile(path, 'utf8')).replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
        const field = (key) => {
          const values = [...text.matchAll(new RegExp(`^\\*\\*${key}:\\*\\* (.+)$`, 'gm'))];
          if (values.length > 1) throw new Error(`Duplicate ${key}: ${name}`);
          return values[0]?.[1].trim();
        };
        const kind = field('Workflow kind');
        const when = field('Select when');
        const priority = field('Selection priority');
        if (!['entry', 'group', 'reference'].includes(kind))
          throw new Error(`Declare Workflow kind (entry/group/reference): ${name}`);
        if (kind !== 'entry') {
          if (when || priority)
            throw new Error(`Only entry workflows have selection metadata: ${name}`);
          continue;
        }
        const title = text.match(/^# (.+)$/m)?.[1];
        if (
          !title ||
          !when ||
          !/^[1-9]\d*$/.test(priority ?? '') ||
          !Number.isSafeInteger(Number(priority)) ||
          /[|\[\]<>]/.test(when + title)
        )
          throw new Error(`Invalid workflow selection metadata: ${name}`);
        if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*\/README\.md$/.test(name))
          throw new Error(`Use kebab-case workflow directories: ${name}`);
        entries.push({ path: name, title, when, priority: Number(priority) });
      }
    }
  }
  await walk(join(root, '.ai-rules/core/workflows'));
  if (!entries.length) throw new Error('No selectable workflows found');
  entries.sort((a, b) => a.priority - b.priority || a.path.localeCompare(b.path));
  for (let index = 1; index < entries.length; index++) {
    if (entries[index - 1].priority === entries[index].priority)
      throw new Error(`Duplicate workflow selection priority: ${entries[index].priority}`);
  }
  return entries;
}

function replaceSelector(text, rows) {
  if (
    text.split(start).length !== 2 ||
    text.split(end).length !== 2 ||
    text.indexOf(start) > text.indexOf(end)
  )
    throw new Error('Expected one workflow-selector marker pair');
  return (
    text.slice(0, text.indexOf(start) + start.length) +
    '\n\n' +
    rows +
    '\n\n' +
    text.slice(text.indexOf(end))
  );
}

export async function syncWorkflows(root, { check = false } = {}) {
  const entries = await discoverWorkflows(root);
  const rows =
    '<!-- prettier-ignore -->\n| Intent / evidence | Select only this primary workflow |\n| --- | --- |\n' +
    entries
      .map((entry) => `| ${entry.when} | [${entry.title}](core/workflows/${entry.path}) |`)
      .join('\n');
  const path = join(root, '.ai-rules/README.md');
  const previous = await readFile(path, 'utf8');
  const next = replaceSelector(previous, rows);
  if (next !== previous) {
    if (check)
      throw new Error(
        'Workflow selector is stale; run node tooling/rules-kit/workflows.mjs --write',
      );
    await writeFile(path, next);
  }
  return entries;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['--check', '--write'].includes(args[0]))
    throw new Error('Usage: node tooling/rules-kit/workflows.mjs --check|--write');
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const entries = await syncWorkflows(root, { check: args[0] === '--check' });
  process.stdout.write(`Workflow selector: ${entries.length} entries (${args[0].slice(2)})\n`);
}
