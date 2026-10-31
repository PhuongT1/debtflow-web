import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
const sourceExtensions = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;
export async function directories(parent) {
  return (await readdir(parent, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(parent, entry.name));
}
export async function packageDirectories(parent) {
  const packages = [];
  for (const directory of await directories(parent)) {
    try {
      await readFile(path.join(directory, 'package.json'), 'utf8');
      packages.push(directory);
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
      packages.push(...(await packageDirectories(directory)));
    }
  }
  return packages;
}
export async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', '.angular', 'dist', 'coverage'].includes(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await sourceFiles(absolute)));
    else if (sourceExtensions.test(entry.name)) files.push(absolute);
  }
  return files;
}
