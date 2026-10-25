import { readFile, readdir, realpath, lstat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { documentDirectories, documentFiles, sectionForPath } from './sections.mjs';

export async function listDocuments(repository, directory) {
  if (!directory) {
    const groups = await Promise.all(
      documentDirectories.map((path) => listDocuments(repository, resolve(repository, path))),
    );
    const files = await Promise.all(
      documentFiles.map(async (path) => {
        try {
          const file = resolve(repository, path);
          if (!(await lstat(file)).isFile()) return [];
          if (!(await realpath(file)).startsWith((await realpath(repository)) + sep)) return [];
          const text = await readFile(file, 'utf8');
          return [
            {
              path,
              title: text.match(/^# (.+)/m)?.[1] ?? path,
              text,
              section: sectionForPath(path)?.id,
            },
          ];
        } catch (error) {
          if (error.code === 'ENOENT') return [];
          throw error;
        }
      }),
    );
    return [...groups.flat(), ...files.flat()].sort((a, b) => a.path.localeCompare(b.path));
  }
  if (directory === resolve(repository, '.ai-rules/generated')) return [];
  let entries;
  try {
    if (!(await lstat(directory)).isDirectory()) return [];
    if (!(await realpath(directory)).startsWith((await realpath(repository)) + sep)) return [];
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
  const groups = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return listDocuments(repository, path);
      if (!entry.isFile() || !entry.name.endsWith('.md')) return [];
      const text = await readFile(path, 'utf8');
      return [
        {
          path: path.slice(repository.length + 1),
          title: text.match(/^# (.+)/m)?.[1] ?? entry.name,
          text,
          section: sectionForPath(path.slice(repository.length + 1))?.id,
        },
      ];
    }),
  );
  return groups.flat().sort((a, b) => a.path.localeCompare(b.path));
}

export { searchDocuments } from './search.mjs';
