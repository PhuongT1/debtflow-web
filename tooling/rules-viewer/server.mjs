import { assets } from './assets.mjs';
import { routeIndex, aliasRouteIndex, documentRoute } from './routes.mjs';
import { canonicalPath } from './aliases.mjs';
import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseDiagram, layoutDiagram } from './diagram.mjs';
import { listDocuments, searchDocuments } from './library.mjs';
import { documentDirectories, documentFiles } from './sections.mjs';

const directory = dirname(fileURLToPath(import.meta.url));
const repository = resolve(directory, '../..');

export async function ruleFile(name) {
  if (typeof name !== 'string' || !name.endsWith('.md')) throw new Error('Markdown only');
  if (
    !documentFiles.includes(name) &&
    !documentDirectories.some((root) => name.startsWith(root + '/'))
  )
    throw new Error('Not an approved document');
  const path = await realpath(resolve(repository, name));
  if (!path.startsWith((await realpath(repository)) + sep)) throw new Error('Outside repository');
  const allowed = await Promise.all(
    [...documentDirectories, ...documentFiles].map(async (source) => {
      try {
        const canonical = await realpath(resolve(repository, source));
        return documentFiles.includes(source)
          ? path === canonical
          : path.startsWith(canonical + sep);
      } catch {
        return false;
      }
    }),
  );
  if (!allowed.some(Boolean)) throw new Error('Outside approved documentation');
  return path;
}

export function documentPayload(path, text) {
  try {
    const graph = parseDiagram(text);
    return { path, text, diagram: graph ? layoutDiagram(graph) : null };
  } catch {
    return {
      path,
      text,
      diagram: null,
      diagramWarning:
        'This diagram uses unsupported syntax. Its original Mermaid source is shown below; the article remains available.',
    };
  }
}

export function createViewerServer() {
  return createServer(async (request, response) => {
    const send = (status, body, type = 'application/json') => {
      response.writeHead(status, {
        'Content-Type': `${type}; charset=utf-8`,
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy':
          "default-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
      });
      response.end(type === 'application/json' ? JSON.stringify(body) : body);
    };
    if (request.method !== 'GET') return send(405, { error: 'Read-only viewer' });
    const url = new URL(request.url, 'http://localhost');
    try {
      if (url.pathname === '/favicon.ico') {
        response.writeHead(204);
        return response.end();
      }
      if (['/api/catalog', '/api/pages', '/api/search'].includes(url.pathname)) {
        const documents = await listDocuments(repository);
        if (url.pathname === '/api/search')
          return send(200, searchDocuments(documents, url.searchParams.get('q') ?? ''));
        const pages =
          url.pathname === '/api/catalog'
            ? documents.filter((item) => item.path.endsWith('/flow.md'))
            : documents;
        return send(
          200,
          pages.map(({ path, title, section }) => ({ path, title, section })),
        );
      }
      if (url.pathname === '/api/document' || url.pathname === '/api/raw') {
        const path = canonicalPath(url.searchParams.get('path'));
        const text = await readFile(await ruleFile(path), 'utf8');
        if (url.pathname === '/api/raw') return send(200, text, 'text/plain');
        return send(200, documentPayload(path, text));
      }
      if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        const pages = await listDocuments(repository);
        const alias = aliasRouteIndex(pages).get(url.pathname);
        if (alias) {
          response.writeHead(308, { Location: documentRoute(alias) + url.search });
          return response.end();
        }
        if (routeIndex(pages).has(url.pathname))
          return send(200, await readFile(resolve(directory, 'index.html')), 'text/html');
      }
      if (!url.pathname.endsWith('/') && !url.pathname.split('/').at(-1).includes('.')) {
        const pages = await listDocuments(repository);
        if (
          routeIndex(pages).has(url.pathname + '/') ||
          aliasRouteIndex(pages).has(url.pathname + '/')
        ) {
          response.writeHead(308, { Location: url.pathname + '/' + url.search });
          return response.end();
        }
      }
      const asset = assets.get(url.pathname);
      if (asset) return send(200, await readFile(resolve(directory, asset[0])), asset[1]);
      return send(404, { error: 'Not found' });
    } catch {
      return send(400, { error: 'Unavailable document or path outside approved documentation' });
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const position = process.argv.indexOf('--port');
  const port = position < 0 ? 4317 : Number(process.argv[position + 1]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
  const server = createViewerServer();
  server.on('error', (error) => {
    process.stderr.write(`Cannot start rules viewer: ${error.message}\n`);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    process.stdout.write(`Rules viewer: http://127.0.0.1:${port}\n`);
  });
}
