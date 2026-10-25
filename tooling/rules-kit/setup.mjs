import { readFile, readdir, lstat, mkdir, writeFile, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve, join, posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const manifestPath = '.ai-rules/.toolkit-generated.json';
import { loadClients, outputPath, generatedIgnore } from './clients.mjs';
const hash = (text) => createHash('sha256').update(text).digest('hex');
const ownedPath = (path) => outputPath(path) && /\.(md|mdc)$/.test(path);

async function optional(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function safePath(root, path) {
  let current = root;
  for (const part of path.split('/')) {
    if (!part || part === '.' || part === '..') throw new Error(`Unsafe generated path: ${path}`);
    current = join(current, part);
    try {
      if ((await lstat(current)).isSymbolicLink()) throw new Error(`Refuse symlink: ${path}`);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  return current;
}

export function metadata(text, path) {
  const header = text.match(/^---\n([\s\S]*?)\n---(?:\n|$)/)?.[1];
  if (!header) throw new Error(`Missing frontmatter: ${path}`);
  const result = {};
  for (const key of ['name', 'description', 'access']) {
    const fields = [...header.matchAll(new RegExp(`^${key}: (.+)$`, 'gm'))];
    if (fields.length > 1) throw new Error(`Duplicate ${key}: ${path}`);
    const value = fields[0]?.[1].trim();
    if (value)
      result[key] = value.startsWith('"')
        ? JSON.parse(value)
        : value.startsWith("'") && value.endsWith("'")
          ? value.slice(1, -1).replaceAll("''", "'")
          : value;
  }
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(result.name ?? '') ||
    result.name.length > 64 ||
    typeof result.description !== 'string' ||
    !result.description ||
    result.description.length > 1024 ||
    /[\r\n|\[\]<>]/.test(result.description) ||
    ['>', '|'].includes(result.description)
  )
    throw new Error(
      `Invalid name/description (use single-line plain or JSON-quoted values): ${path}`,
    );
  return result;
}

export async function discoverCapabilities(root) {
  const skills = [],
    agents = [];
  async function walk(path, kind) {
    let files;
    try {
      await safePath(root, path);
      files = await readdir(join(root, path), { withFileTypes: true });
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    for (const entry of files) {
      const source = path + '/' + entry.name;
      if (entry.isSymbolicLink()) throw new Error(`Refuse capability symlink: ${source}`);
      if (entry.isDirectory()) {
        await walk(source, kind);
        continue;
      }
      if (
        !entry.isFile() ||
        (kind === 'skill'
          ? entry.name !== 'SKILL.md'
          : !entry.name.endsWith('.md') || entry.name === 'README.md')
      )
        continue;
      const text = await readFile(join(root, source), 'utf8');
      const meta = metadata(text, source);
      if (kind === 'skill' && source.split('/').at(-2) !== meta.name)
        throw new Error(`Skill directory must match name: ${source}`);
      if (
        kind === 'agent' &&
        !['read-only', 'implementation', 'verification'].includes(meta.access)
      )
        throw new Error(`Invalid role access: ${source}`);
      (kind === 'skill' ? skills : agents).push({ ...meta, source, text });
    }
  }
  for (const layer of ['core', 'project']) {
    await walk(`.ai-rules/${layer}/skills`, 'skill');
    await walk(`.ai-rules/${layer}/agents`, 'agent');
  }
  for (const items of [skills, agents]) {
    items.sort((a, b) => a.name.localeCompare(b.name));
    if (new Set(items.map((item) => item.name)).size !== items.length)
      throw new Error('Duplicate capability name; project extensions must use distinct names');
  }
  return { skills, agents };
}

function rebase(text, source, target) {
  return text.replace(/(\[[^\]]*\]\()([^\s)]+)(\))/g, (all, before, link, after) => {
    if (/^[a-z]+:/i.test(link) || link.startsWith('#')) return all;
    const [path, anchor] = link.split('#');
    const destination = posix.resolve('/', posix.dirname(source), path);
    const rebased = posix.relative(posix.resolve('/', posix.dirname(target)), destination);
    return before + rebased + (anchor ? '#' + anchor : '') + after;
  });
}

export async function syncToolkit(root, { check = false } = {}) {
  root = resolve(root);
  await safePath(root, '.ai-rules/clients.json');
  const registry = await loadClients(root);
  const config = JSON.parse(
    (await optional(await safePath(root, '.ai-rules/project/tools.json'))) ?? '{}',
  );
  const local = JSON.parse(
    (await optional(await safePath(root, '.ai-rules/tools.local.json'))) ?? '{}',
  );
  const targets = local.targets ?? config.targets ?? registry.defaults;
  if (
    !Array.isArray(targets) ||
    targets.some((item) => typeof item !== 'string' || !Object.hasOwn(registry.clients, item)) ||
    new Set(targets).size !== targets.length
  )
    throw new Error(
      `Unknown/duplicate client target. Registered: ${Object.keys(registry.clients).join(', ')}. Use generic for repository-aware tools, or add a verified adapter in .ai-rules/clients.json.`,
    );
  const capabilities = await discoverCapabilities(root);
  const expected = new Map();
  const notice =
    '<!-- Generated by tooling/rules-kit/setup.mjs. Edit canonical .ai-rules sources, then regenerate. -->\n';
  for (const tool of targets) {
    const client = registry.clients[tool];
    const skillRoot = client.skillRoot;
    if (skillRoot)
      for (const skill of capabilities.skills) {
        const target = `${skillRoot}/${skill.name}/SKILL.md`;
        expected.set(target, rebase(skill.text, skill.source, target) + '\n' + notice);
      }
    if (client.roles)
      for (const agent of capabilities.agents) {
        const target = `${client.roles.directory}/${agent.name}.md`;
        const tools =
          agent.access === 'read-only'
            ? 'Read, Grep, Glob'
            : agent.access === 'verification'
              ? 'Read, Grep, Glob, Bash'
              : 'Read, Edit, Write, Grep, Glob';
        const native = agent.text.replace(/^access: .+$/m, `tools: ${tools}\nmodel: inherit`);
        expected.set(target, rebase(native, agent.source, target) + '\n' + notice);
      }
    const target = client.instruction?.path;
    if (target) {
      const header = client.instruction.header;
      expected.set(
        target,
        header +
          notice +
          '\n' +
          rebase(
            '# Engineering Toolkit\n\nFollow [repository instructions](AGENTS.md), the [task selector](.ai-rules/README.md) and the current [project profile](.ai-rules/project/README.md). Discover task skills and role profiles in the [capability catalog](.ai-rules/CATALOG.md); read only what the task needs. Native roles are optional and do not grant permission to delegate or broaden scope.\n',
            'ENTRY.md',
            target,
          ),
      );
    }
  }
  const rows = (items) =>
    items
      .map(
        (item) =>
          `- [${item.name}](${item.source.slice('.ai-rules/'.length)}): ${item.description}`,
      )
      .join('\n');
  expected.set(
    '.ai-rules/CATALOG.md',
    notice +
      '\n# Capability Catalog\n\nGenerated from current core/project sources. Edit those files, then run `node tooling/rules-kit/setup.mjs --write`; this catalog is not a second policy body.\n\n## Skills\n\n' +
      (rows(capabilities.skills) || 'No skills configured.') +
      '\n\n## Agent roles\n\n' +
      (rows(capabilities.agents) || 'No roles configured.') +
      '\n\n## Client projections\n\nConfigured targets: ' +
      (targets.join(', ') || 'none') +
      '. Client paths and formats are declared in clients.json. Native role registration is available only where an adapter implements it. The generic adapter produces a Markdown entry that must be connected in the chosen tool. Setup does not grant permissions or execute agents.\n',
  );

  const ignorePath = await safePath(root, '.gitignore');
  const oldIgnore = (await optional(ignorePath)) ?? '';
  const nextIgnore = generatedIgnore(oldIgnore, registry);
  const previousText = await optional(await safePath(root, manifestPath));
  const previous = previousText ? JSON.parse(previousText) : { version: 1, files: {} };
  if (previous.version !== 1 || !previous.files || typeof previous.files !== 'object')
    throw new Error('Invalid toolkit manifest');
  const changes = [];
  for (const path of new Set([...Object.keys(previous.files), ...expected.keys()])) {
    if (!ownedPath(path)) throw new Error(`Unexpected managed path: ${path}`);
    const absolute = await safePath(root, path);
    const actual = await optional(absolute);
    const next = expected.get(path) ?? null;
    if (actual === next) continue;
    if (next === null && actual !== null && !actual.includes(notice.trim()))
      throw new Error(`Refuse to delete an unrecognized generated file: ${path}`);
    if (actual !== null && (!previous.files[path] || hash(actual) !== previous.files[path]))
      throw new Error(`Refuse to replace/delete hand-edited or unowned file: ${path}`);
    changes.push({ absolute, next });
  }
  const manifest =
    JSON.stringify(
      {
        version: 1,
        files: Object.fromEntries([...expected].map(([path, text]) => [path, hash(text)])),
      },
      null,
      2,
    ) + '\n';
  if (check && (changes.length || previousText !== manifest || oldIgnore !== nextIgnore))
    throw new Error('Toolkit projections are stale; run node tooling/rules-kit/setup.mjs --write');
  if (!check) {
    if (oldIgnore !== nextIgnore) await writeFile(ignorePath, nextIgnore);
    for (const { absolute, next } of changes) {
      if (next === null) await unlink(absolute);
      else {
        await mkdir(dirname(absolute), { recursive: true });
        await writeFile(absolute, next);
      }
    }
    await writeFile(join(root, manifestPath), manifest);
  }
  return { ...capabilities, targets, clients: registry.clients, files: expected.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  if (args.length !== 1 || !['--write', '--check'].includes(args[0]))
    throw new Error('Usage: setup.mjs --write|--check');
  const result = await syncToolkit(resolve(dirname(fileURLToPath(import.meta.url)), '../..'), {
    check: args[0] === '--check',
  });
  process.stdout.write(
    `Toolkit: ${result.skills.length} skills, ${result.agents.length} roles, ${result.files} projections (${args[0].slice(2)})\n`,
  );
  if (args[0] === '--write') {
    for (const target of result.targets) {
      const client = result.clients[target];
      process.stdout.write(
        `${client.label}: project entry ${client.entry}; ${client.skillRoot ? 'skills ' + client.skillRoot : 'instruction adapter ' + client.instruction.path}${client.roles ? '; optional roles ' + client.roles.directory : ''}\n`,
      );
    }
    process.stdout.write(
      'Edit sources in .ai-rules/core/ or .ai-rules/project/, not generated client files.\nReload/start a new session in this repository and confirm skill discovery. Catalog: .ai-rules/CATALOG.md\n',
    );
  }
}
