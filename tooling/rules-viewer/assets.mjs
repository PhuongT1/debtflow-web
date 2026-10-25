export const assets = new Map([
  ['/', ['index.html', 'text/html']],
  ['/favicon.svg', ['favicon.svg', 'image/svg+xml']],
  ...[
    'icons.js',
    'code-block.js',
    'aliases.mjs',
    'routes.mjs',
    'data.js',
    'search.mjs',
    'site.config.mjs',
  ].map((name) => ['/' + name, [name, 'text/javascript']]),
  ['/viewer.js', ['viewer.js', 'text/javascript']],
  ['/viewer.css', ['viewer.css', 'text/css']],
  ['/diagram-view.js', ['diagram-view.js', 'text/javascript']],
  ['/document-view.js', ['document-view.js', 'text/javascript']],
  ['/navigation.js', ['navigation.js', 'text/javascript']],
  ['/sections.mjs', ['sections.mjs', 'text/javascript']],
  ['/search-view.js', ['search-view.js', 'text/javascript']],
]);
for (const name of [
  'base',
  'shell',
  'page',
  'article',
  'contents',
  'diagram',
  'search',
  'responsive',
  'navigation',
  'highlight',
]) {
  assets.set(`/styles/${name}.css`, [`styles/${name}.css`, 'text/css']);
}
