import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, join, sep, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { normalizeBase } from './build.mjs';

export function createPreviewServer({ output = 'dist/docs', base = '/' } = {}) {
  base = normalizeBase(base);
  const root = resolve(output);
  return createServer(async (request, response) => {
    try {
      if (request.method !== 'GET') {
        response.writeHead(405).end();
        return;
      }
      const url = new URL(request.url, 'http://localhost');
      if (!url.pathname.startsWith(base)) throw new Error('Not found');
      const name = decodeURIComponent(url.pathname.slice(base.length));
      let path = resolve(root, name || '.');
      if (path !== root && !path.startsWith(root + sep)) throw new Error('Not found');
      if ((await stat(path)).isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          response.writeHead(308, { Location: url.pathname + '/' + url.search }).end();
          return;
        }
        path = join(path, 'index.html');
      }
      const actual = await realpath(path);
      if (!actual.startsWith((await realpath(root)) + sep)) throw new Error('Not found');
      const mime =
        {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.mjs': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.svg': 'image/svg+xml',
          '.md': 'text/plain',
        }[extname(path)] || 'application/octet-stream';
      response.writeHead(200, {
        'Content-Type': mime + '; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      });
      response.end(await readFile(actual));
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2);
  const options = {};
  let port = 4318;
  for (let index = 0; index < args.length; index += 2) {
    const field = { '--out': 'output', '--base': 'base', '--port': 'port' }[args[index]];
    if (!field || !args[index + 1])
      throw new Error('Usage: preview.mjs [--out directory] [--base /path/] [--port number]');
    if (field === 'port') port = Number(args[index + 1]);
    else options[field] = args[index + 1];
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid port');
  createPreviewServer(options).listen(port, '127.0.0.1', () =>
    process.stdout.write(`Docs preview: http://127.0.0.1:${port}${options.base ?? '/'}\n`),
  );
}
