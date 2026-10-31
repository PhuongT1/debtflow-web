import { lstat } from 'node:fs/promises';
import { join } from 'node:path';
export async function safePath(root, path) {
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
