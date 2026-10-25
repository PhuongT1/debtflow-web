import { documentAliases } from './aliases.mjs';

// Derive public URLs from source paths; titles never become a second slug registry.
export function documentRoute(source, base = '/') {
  let path = source;
  if (path === 'docs/README.md') path = 'documentation/README.md';
  else if (path.startsWith('docs/')) path = path.slice(5);
  else if (path.startsWith('.ai-rules/')) path = 'rules/' + path.slice(10);
  else if (path === 'AGENTS.md') path = 'agent-entry/README.md';
  else path = 'source/' + path.replace('/.ai-rules/', '/rules/');
  path = path
    .replace(/(^|\/)README\.md$/, '')
    .replace(/\.md$/, '')
    .replace(/\/$/, '');
  return base + path.split('/').map(encodeURIComponent).join('/') + '/';
}

export function routeIndex(pages, base = '/') {
  const routes = new Map();
  for (const page of pages) {
    const route = documentRoute(page.path, base);
    if (routes.has(route)) throw new Error(`Duplicate documentation route: ${route}`);
    routes.set(route, page.path);
  }
  return routes;
}

// Only expose aliases whose canonical source exists in this site's approved catalog.
export function aliasRouteIndex(pages, base = '/') {
  const canonical = routeIndex(pages, base);
  const paths = new Set(pages.map((page) => page.path));
  const aliases = new Map();
  for (const [oldPath, newPath] of Object.entries(documentAliases)) {
    if (!paths.has(newPath)) continue;
    const route = documentRoute(oldPath, base);
    if (canonical.has(route) && canonical.get(route) !== newPath)
      throw new Error(`Alias shadows a canonical documentation route: ${route}`);
    if (aliases.has(route) && aliases.get(route) !== newPath)
      throw new Error(`Conflicting documentation aliases: ${route}`);
    if (!canonical.has(route)) aliases.set(route, newPath);
  }
  return aliases;
}

export function resolveSourceLink(target, source) {
  const url = new URL(target, `https://source.invalid/${source}`);
  return {
    path: decodeURIComponent(url.pathname.slice(1)),
    anchor: decodeURIComponent(url.hash.slice(1)),
  };
}
