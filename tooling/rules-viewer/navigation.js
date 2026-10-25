import { icon } from './icons.js';
import { sections, sectionForPath, belongsToGroup } from './sections.mjs';
export { pageUrl as docUrl } from './data.js';
import { pageUrl as docUrl } from './data.js';
const names = {
  ui: 'UI',
  'non-ui': 'Non-UI',
  react: 'React',
  nextjs: 'Next.js',
  i18n: 'I18n',
  'api-contracts': 'API Contracts',
  'ai-guide': 'AI Guide',
  '.ai-rules': 'AI Rules',
  AGENTS: 'AGENTS',
};
const label = (name) => {
  const stem = name.replace(/\.md$/, '');
  return (
    names[stem] ??
    stem
      .split('-')
      .map((word) => word[0]?.toUpperCase() + word.slice(1))
      .join(' ')
  );
};

function sourceTree(pages, group, openRule) {
  const rootPath = group.root === '.' ? '' : group.root;
  const root = { children: new Map(), files: [] };
  for (const page of pages) {
    const relative =
      rootPath && page.path.startsWith(rootPath + '/')
        ? page.path.slice(rootPath.length + 1)
        : page.path;
    const parts = relative.split('/');
    let branch = root;
    for (const part of parts.slice(0, -1)) {
      if (!branch.children.has(part)) branch.children.set(part, { children: new Map(), files: [] });
      branch = branch.children.get(part);
    }
    branch.files.push(page);
  }
  const rank = (name) => {
    const index = group.order?.indexOf(name) ?? -1;
    return index < 0 ? Infinity : index;
  };
  function list(branch, prefix = rootPath) {
    const ul = document.createElement('ul');
    for (const file of branch.files.sort(
      (a, b) =>
        b.path.endsWith('/README.md') - a.path.endsWith('/README.md') ||
        a.path.localeCompare(b.path),
    )) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      const basename = file.path.split('/').at(-1);
      link.textContent = basename === 'README.md' ? 'Overview' : label(basename);
      link.href = docUrl(file.path);
      link.dataset.path = file.path;
      link.title = `${file.title}\n${file.path}`;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openRule(file.path, '');
      });
      li.append(link);
      ul.append(li);
    }
    for (const [name, child] of [...branch.children].sort(
      ([a], [b]) => rank(a) - rank(b) || a.localeCompare(b),
    )) {
      const li = document.createElement('li');
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      const folder = prefix ? `${prefix}/${name}` : name;
      details.dataset.folder = folder;
      summary.textContent = label(name);
      summary.title = folder;
      details.append(summary, list(child, folder));
      li.append(details);
      ul.append(li);
    }
    return ul;
  }
  return list(root);
}
export function buildTree(container, pages, openRule, section = sections[0]) {
  container.replaceChildren();
  for (const group of section.groups) {
    const matches = pages.filter((page) => belongsToGroup(page.path, group));
    if (!matches.length) continue;
    const branch = document.createElement('details');
    branch.className = 'nav-family';
    const summary = document.createElement('summary');
    const title = document.createElement('span');
    title.className = 'nav-label';
    title.textContent = group.title;
    summary.title = group.root;
    summary.append(title);
    branch.append(summary, sourceTree(matches, group, openRule));
    container.append(branch);
  }
  document.querySelector('#section-name').textContent = section.title;
  document.querySelector('#section-description').textContent = section.description;
  document.querySelector('#section-icon').replaceChildren(icon(section.icon));
  document.querySelector('#section-select').value = section.id;
  document.body.dataset.section = section.id;
}
export function selectTree(path) {
  document.querySelectorAll('#tree a[data-path]').forEach((link) => {
    if (link.dataset.path === path) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelectorAll('#tree details').forEach((group) => {
    const active = [...group.querySelectorAll('a[data-path]')].some(
      (link) => link.dataset.path === path,
    );
    group.classList.toggle('active-branch', active);
    if (active) group.open = true;
  });
}
export function breadcrumbs(path, pages, openRule) {
  const nav = document.querySelector('#breadcrumbs');
  nav.replaceChildren();
  const section = sectionForPath(path) ?? sections[0];
  nav.hidden = path === section.home;
  const group = section.groups.find((candidate) => belongsToGroup(path, candidate));
  const root = group?.root === '.' ? '' : (group?.root ?? '');
  const relative = root && path.startsWith(root + '/') ? path.slice(root.length + 1) : path;
  const parts = relative.split('/');
  const segments = [{ name: section.title, path: section.home }];
  if (root !== section.home.replace('/README.md', ''))
    segments.push({ name: group.title, path: root + '/README.md' });
  parts.slice(0, -1).forEach((part, i) =>
    segments.push({
      name: label(part),
      path: [root, ...parts.slice(0, i + 1), 'README.md'].filter(Boolean).join('/'),
    }),
  );
  if (parts.at(-1) !== 'README.md') segments.push({ name: label(parts.at(-1)), path });
  segments.forEach((segment, i) => {
    const node = document.createElement(
      pages.some((page) => page.path === segment.path) && i < segments.length - 1 ? 'a' : 'span',
    );
    node.textContent = segment.name;
    if (node.tagName === 'A') {
      node.href = docUrl(segment.path);
      node.addEventListener('click', (event) => {
        event.preventDefault();
        openRule(segment.path, '');
      });
    }
    nav.append(node);
  });
}
export function tableOfContents(path, openRule) {
  const headings = document.querySelectorAll('#details h2,#details h3');
  document.querySelector('.toc-panel').hidden = headings.length === 0;
  document.querySelector('.inline-toc').hidden = headings.length === 0;
  for (const id of ['toc', 'inline-toc']) {
    const nav = document.getElementById(id);
    nav.replaceChildren();
    for (const heading of headings) {
      const link = document.createElement('a');
      link.textContent = heading.textContent;
      link.href = docUrl(path, heading.id);
      if (heading.tagName === 'H3') link.classList.add('subsection');
      link.addEventListener('click', (event) => {
        event.preventDefault();
        openRule('#' + heading.id, path);
      });
      nav.append(link);
    }
  }
}
