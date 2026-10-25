import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export function outputPath(path) {
  if (typeof path === 'string' && /[\r\n]/.test(path)) return false;
  if (
    typeof path !== 'string' ||
    !/^\.[a-z][a-z0-9-]*\/[a-zA-Z0-9_./-]+$/.test(path) ||
    path.split('/').some((part) => !part || part === '.' || part === '..')
  )
    return false;
  if (/^\.(?:git|env|codex|aws|ssh|idea|vscode)(?:\/|$)/.test(path)) return false;
  if (path.startsWith('.ai-rules/'))
    return path === '.ai-rules/CATALOG.md' || path.startsWith('.ai-rules/generated/');
  if (path.startsWith('.github/')) return path.startsWith('.github/instructions/');
  return true;
}

export async function loadClients(root) {
  const registry = JSON.parse(await readFile(join(root, '.ai-rules/clients.json'), 'utf8'));
  if (registry.version !== 1 || !registry.clients || !Array.isArray(registry.defaults))
    throw new Error('Invalid clients.json registry');
  const outputs = new Set();
  for (const [id, client] of Object.entries(registry.clients)) {
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
      typeof client.label !== 'string' ||
      !client.label ||
      typeof client.entry !== 'string' ||
      /[\r\n]/.test(client.label + client.entry)
    )
      throw new Error(`Invalid client metadata: ${id}`);
    const paths = [];
    if (client.skillRoot) paths.push(client.skillRoot);
    if (client.instruction) {
      if (
        typeof client.instruction.header !== 'string' ||
        !/\.(md|mdc)$/.test(client.instruction.path)
      )
        throw new Error(`Invalid client instruction: ${id}`);
      paths.push(client.instruction.path);
    }
    if (client.roles) {
      if (client.roles.format !== 'claude')
        throw new Error(`Unsupported native role format: ${id}`);
      paths.push(client.roles.directory);
    }
    if (!paths.length || paths.some((path) => !outputPath(path)))
      throw new Error(`Unsafe or missing client output: ${id}`);
    for (const path of paths) {
      if (
        [...outputs].some(
          (other) => path === other || path.startsWith(other + '/') || other.startsWith(path + '/'),
        )
      )
        throw new Error(`Overlapping client output: ${path}`);
      outputs.add(path);
    }
  }
  if (
    new Set(registry.defaults).size !== registry.defaults.length ||
    registry.defaults.some((id) => !Object.hasOwn(registry.clients, id))
  )
    throw new Error('Invalid default clients');
  return registry;
}

export function generatedIgnore(text, registry) {
  const start = '# AI toolkit generated outputs (managed by rules:setup)';
  const end = '# End AI toolkit generated outputs';
  const patterns = new Set([
    '/.ai-rules/.toolkit-generated.json',
    '/.ai-rules/CATALOG.md',
    '/.ai-rules/tools.local.json',
  ]);
  for (const client of Object.values(registry.clients)) {
    if (client.skillRoot) patterns.add('/' + client.skillRoot + '/');
    if (client.roles) patterns.add('/' + client.roles.directory + '/');
    if (client.instruction) patterns.add('/' + client.instruction.path);
  }
  const block = start + '\n' + [...patterns].sort().join('\n') + '\n' + end;
  if (!text.includes(start) && !text.includes(end)) return text.trimEnd() + '\n\n' + block + '\n';
  if (
    text.split(start).length !== 2 ||
    text.split(end).length !== 2 ||
    text.indexOf(start) > text.indexOf(end)
  )
    throw new Error('Invalid generated .gitignore markers');
  return text.slice(0, text.indexOf(start)) + block + text.slice(text.indexOf(end) + end.length);
}
