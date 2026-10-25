import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

export function fixtureServer(root) {
  root = resolve(root);
  return createServer(async (request, response) => {
    try {
      if (request.method !== 'GET') {
        response.writeHead(405).end();
        return;
      }
      const url = new URL(request.url, 'http://localhost');
      if (url.pathname === '/favicon.ico') {
        response.writeHead(204).end();
        return;
      }
      const name = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      if (name !== '/index.html' && !name.startsWith('/src/')) throw new Error('Not found');
      const file = await realpath(resolve(root, '.' + name));
      if (!file.startsWith((await realpath(root)) + sep)) throw new Error('Not found');
      const type = { '.html': 'text/html', '.css': 'text/css', '.mjs': 'text/javascript' }[
        extname(file)
      ];
      if (!type) throw new Error('Not found');
      response.writeHead(200, {
        'Content-Type': `${type}; charset=utf-8`,
        'Cache-Control': 'no-store',
      });
      response.end(await readFile(file));
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const portIndex = process.argv.indexOf('--port');
  const port = Number(portIndex === -1 ? 4321 : process.argv[portIndex + 1]);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
  fixtureServer(process.cwd()).listen(port, '127.0.0.1', () =>
    console.log(`Fixture: http://127.0.0.1:${port}/`),
  );
}
