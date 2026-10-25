import { mkdir, readFile, writeFile, lstat, rm, realpath } from 'node:fs/promises';
import { dirname, resolve, join, sep, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assets } from './assets.mjs';
import { listDocuments } from './library.mjs';
import { documentPayload } from './server.mjs';
import { documentRoute, routeIndex, aliasRouteIndex } from './routes.mjs';

const directory = dirname(fileURLToPath(import.meta.url));
const repository = resolve(directory, '../..');
const marker = '.rules-docs-build.json';
const signature = 'rules-docs-static-v1';
async function physicalDestination(path) {
  try {
    return await realpath(path);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return join(await physicalDestination(dirname(path)), basename(path));
  }
}
export function normalizeBase(value = '/') {
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*$/.test(value))
    throw new Error('Base must be / or a path such as /handbook/');
  return value;
}
export async function buildDocs({
  output = join(repository, 'dist/docs'),
  base = '/',
  root = repository,
} = {}) {
  base = normalizeBase(base);
  output = resolve(output);
  root = await realpath(resolve(root));
  const physical = await physicalDestination(output);
  if (
    root === physical ||
    root.startsWith(physical + sep) ||
    ['.ai-rules', 'docs', 'tooling', 'apps', 'packages'].some(
      (name) => physical === join(root, name) || physical.startsWith(join(root, name) + sep),
    )
  )
    throw new Error('Output must be a generated directory outside documentation/source folders');
  try {
    const stat = await lstat(output);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('Unsafe build output');
    const previous = JSON.parse(await readFile(join(output, marker), 'utf8'));
    if (previous.signature !== signature)
      throw new Error('Output is not a rules documentation build');
    // Only a directory previously created by this builder can be replaced.
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    try {
      await lstat(output);
      throw new Error('Existing output has no build marker');
    } catch (existing) {
      if (existing.code !== 'ENOENT') throw existing;
    }
  }
  const pages = await listDocuments(root);
  if (!pages.length) throw new Error('No approved Markdown documents found');
  routeIndex(pages, base);
  const aliases = aliasRouteIndex(pages);
  const html = (await readFile(join(directory, 'index.html'), 'utf8'))
    .replace(
      '<meta charset="utf-8" />',
      '<meta charset="utf-8" /><meta name="docs-mode" content="static" />',
    )
    .replaceAll('href="/favicon.svg"', `href="${base}favicon.svg"`)
    .replaceAll('href="/viewer.css"', `href="${base}viewer.css"`)
    .replaceAll('src="/viewer.js"', `src="${base}viewer.js"`);
  const payloads = pages.map((page) => ({ ...page, ...documentPayload(page.path, page.text) }));
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });
  for (const [route, [name]] of assets) {
    if (route === '/') continue;
    const target = join(output, route.slice(1));
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, await readFile(join(directory, name)));
  }
  await mkdir(join(output, 'data'));
  await writeFile(join(output, 'data/documents.json'), JSON.stringify(payloads));
  for (const page of pages) {
    const pagePath = join(output, documentRoute(page.path, '/').slice(1), 'index.html');
    const rawPath = join(output, 'raw', page.path);
    await mkdir(dirname(pagePath), { recursive: true });
    await mkdir(dirname(rawPath), { recursive: true });
    await writeFile(pagePath, html);
    await writeFile(rawPath, page.text);
  }
  // Compatibility shells contain no copied Markdown or extra search entries.
  // The client resolves the old route and normalizes it to the canonical source URL.
  for (const route of aliases.keys()) {
    const pagePath = join(output, route.slice(1), 'index.html');
    await mkdir(dirname(pagePath), { recursive: true });
    await writeFile(pagePath, html);
  }
  await writeFile(join(output, 'index.html'), html);
  await writeFile(join(output, marker), JSON.stringify({ signature, base, pages: pages.length }));
  return { output, base, pages: pages.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = {};
  const args = process.argv.slice(2);
  for (let index = 0; index < args.length; index += 2) {
    const name = { '--out': 'output', '--base': 'base' }[args[index]];
    if (!name || !args[index + 1])
      throw new Error('Usage: build.mjs [--out directory] [--base /path/]');
    options[name] = args[index + 1];
  }
  process.stdout.write(JSON.stringify(await buildDocs(options)) + '\n');
}
