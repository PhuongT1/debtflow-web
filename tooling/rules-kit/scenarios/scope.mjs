import { readdir, readFile, readlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

export async function snapshot(root, prefix = '') {
  const files = {};
  for (const entry of await readdir(join(root, prefix), { withFileTypes: true })) {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    const artifact = ['.evaluation-artifacts', '.playwright-mcp'].some(
      (root) => name === root || name.startsWith(root + '/'),
    );
    if (entry.isDirectory()) {
      if (!artifact) files[name + '/'] = 'directory';
      Object.assign(files, await snapshot(root, name));
    } else if (entry.isSymbolicLink())
      files[name] = 'symlink:' + (await readlink(join(root, name)));
    else if (!artifact || !/\.(png|jpe?g|webp|txt|log|ya?ml|json|md)$/.test(name))
      files[name] = createHash('sha256')
        .update(await readFile(join(root, name)))
        .digest('hex');
  }
  return files;
}

export function assessScope(before, after, allowedFiles) {
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((path) => before[path] !== after[path])
    .sort();
  const unauthorized = changed.filter((path) => !allowedFiles.includes(path));
  return { changed, unauthorized, passed: unauthorized.length === 0 };
}
