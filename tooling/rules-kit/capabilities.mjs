import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { safePath } from './generated-paths.mjs';
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
