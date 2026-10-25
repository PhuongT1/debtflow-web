import { loadPages, loadDocument, rawDocumentUrl, siteBase } from './data.js';
import { documentRoute, aliasRouteIndex } from './routes.mjs';
import { canonicalPath } from './aliases.mjs';
import { icon } from './icons.js';
import { createDiagramView } from './diagram-view.js';
import { renderDocument } from './document-view.js';
import { buildTree, selectTree, breadcrumbs, tableOfContents, docUrl } from './navigation.js';
import { setupSearch } from './search-view.js';
import { sections, sectionForPath, site } from './sections.mjs';

const status = document.querySelector('#status');
const section = document.querySelector('#diagram-section');
let pages = [];
let current;
let activeSection;
let requestId = 0;
const diagram = createDiagramView(
  document.querySelector('#diagram'),
  document.querySelector('#zoom'),
  openRule,
);

async function openRule(target, base = '.ai-rules/README.md', push = true) {
  const id = ++requestId;
  try {
    const url = new URL(target, `http://rules.local/${base}`);
    const path = canonicalPath(decodeURIComponent(url.pathname.slice(1)));
    const anchor = decodeURIComponent(url.hash.slice(1));
    if (!path.endsWith('.md'))
      throw new Error(
        'Source reference: open this file in your editor. The documentation viewer serves approved Markdown only.',
      );
    if (current?.path !== path) {
      const data = await loadDocument(path);
      if (id !== requestId) return;
      current = data;
      const title = data.text.match(/^# (.+)/m)?.[1] ?? path.split('/').at(-1);
      document.title = `${title} · ${site.name} Docs`;
      document.querySelector('#page-title').textContent = title;
      renderDocument(
        document.querySelector('#details'),
        data.text,
        path,
        openRule,
        '',
        true,
        Boolean(data.diagramWarning),
      );
      document.querySelector('#diagram-warning').textContent = data.diagramWarning ?? '';
      const selectedSection = sectionForPath(path) ?? sections[0];
      if (activeSection !== selectedSection.id) {
        buildTree(document.querySelector('#tree'), pages, openRule, selectedSection);
        activeSection = selectedSection.id;
      }
      section.hidden = !data.diagram;
      if (data.diagram) diagram.show(data.diagram, path);
      document.querySelector('#document-path').textContent = path;
      document.querySelector('#source').href = rawDocumentUrl(path);
      document.querySelector('#source').title = path;
      selectTree(path);
      breadcrumbs(path, pages, openRule);
      tableOfContents(path, openRule);
      document.querySelectorAll('.top-nav a').forEach((link) => {
        if (link.dataset.section === selectedSection.id) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    }
    if (push && location.pathname + location.search + location.hash !== docUrl(path, anchor))
      window.history.pushState(null, '', docUrl(path, anchor));
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
    document.body.removeAttribute('data-menu-open');
    document.querySelector('#menu').setAttribute('aria-expanded', 'false');
    status.textContent = '';
  } catch (error) {
    if (id === requestId) status.textContent = error.message;
  }
}

function route() {
  const legacy = new URLSearchParams(location.search).get('doc');
  const alias = aliasRouteIndex(pages, siteBase).get(location.pathname);
  const path = legacy
    ? canonicalPath(legacy)
    : (pages.find((page) => documentRoute(page.path, siteBase) === location.pathname)?.path ??
      alias);
  if (!path && location.pathname !== siteBase) {
    status.textContent = 'Document unavailable. Choose a page from the navigation.';
    return;
  }
  const selected = path ?? sections[0].home;
  if (legacy || alias || location.pathname === siteBase)
    window.history.replaceState(null, '', docUrl(selected) + location.hash);
  return openRule(selected + location.hash, '', false);
}
document.querySelector('.brand').replaceChildren();
const mark = document.createElement('span');
mark.className = 'brand-mark';
mark.textContent = site.mark;
const suffix = document.createElement('span');
suffix.textContent = 'docs';
document.querySelector('.brand').append(mark, document.createTextNode(site.name + ' '), suffix);
document.querySelector('.brand').href = docUrl(sections[0].home);
document.querySelector('.page-footer > span').textContent = site.footer;
for (const item of sections) {
  const link = document.createElement('a');
  link.dataset.section = item.id;
  link.dataset.doc = item.home;
  link.href = docUrl(item.home);
  link.append(icon(item.icon), document.createTextNode(item.title));
  document.querySelector('.top-nav').append(link);
}
document.querySelectorAll('a[data-doc]').forEach((link) => {
  link.href = docUrl(link.dataset.doc);
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openRule(link.dataset.doc, '');
  });
});
const ZOOM_STEP = 1.25;
document.querySelector('#zoom-in').addEventListener('click', () => diagram.scale(ZOOM_STEP));
document.querySelector('#zoom-out').addEventListener('click', () => diagram.scale(1 / ZOOM_STEP));
document.querySelector('#fit').addEventListener('click', diagram.fit);
document.querySelector('#reset').addEventListener('click', diagram.reset);
document.querySelector('#menu').addEventListener('click', () => {
  const open = document.body.toggleAttribute('data-menu-open');
  document.querySelector('#menu').setAttribute('aria-expanded', String(open));
});
async function copyText(value, success) {
  if (!value) return;
  try {
    await navigator.clipboard.writeText(value);
    status.textContent = success;
  } catch {
    status.textContent = 'Clipboard unavailable. Select the source path or use View Markdown.';
  }
}
document
  .querySelector('#copy')
  .addEventListener('click', () => copyText(current?.text, 'Markdown copied.'));
document
  .querySelector('#copy-path')
  .addEventListener('click', () => copyText(current?.path, 'Source path copied.'));
window.addEventListener('popstate', route);
new ResizeObserver(() => diagram.fit()).observe(document.querySelector('#diagram'));
setupSearch(openRule);
const sectionSelect = document.querySelector('#section-select');
for (const item of sections) {
  const option = document.createElement('option');
  option.value = item.id;
  option.textContent = item.title;
  sectionSelect.append(option);
}
sectionSelect.addEventListener('change', () =>
  openRule(sections.find((item) => item.id === sectionSelect.value).home, ''),
);
try {
  pages = await loadPages();
  await route();
} catch (error) {
  status.textContent = error.message;
}
