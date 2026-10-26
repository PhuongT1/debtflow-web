import { appendCode, codeBlock } from './code-block.js';
import { pageUrl } from './data.js';
import { resolveSourceLink } from './routes.mjs';
import { canonicalPath } from './aliases.mjs';
const slug = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\- ]/g, '')
    .replaceAll(' ', '-');

function inline(parent, text, path, openRule) {
  const pattern = /\[((?:`[^`]*`|[^\]])+)\]\((<[^>]+>|[^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    parent.append(document.createTextNode(text.slice(offset, match.index)));
    const node = document.createElement(match[1] ? 'a' : match[3] ? 'strong' : 'code');
    node.textContent = match[1] ?? match[3] ?? match[4];
    if (match[1]) {
      const target = match[2].replace(/^<|>$/g, '');
      node.href = target;
      if (/^https?:\/\//.test(target)) {
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
      } else {
        const link = resolveSourceLink(target, path);
        if (link.path.endsWith('.md')) node.href = pageUrl(canonicalPath(link.path), link.anchor);
        node.addEventListener('click', (event) => {
          event.preventDefault();
          openRule(target, path);
        });
      }
    }
    parent.append(node);
    offset = match.index + match[0].length;
  }
  parent.append(document.createTextNode(text.slice(offset)));
}

export function renderDocument(
  container,
  text,
  path,
  openRule,
  anchor,
  skipTitle = false,
  showDiagramSource = false,
) {
  container.replaceChildren();
  let code;
  let language = '';
  let callout;
  let diagramSource = false;
  let table;
  let lists = [];
  const ids = new Map();
  // Discovery metadata remains in raw/copy Markdown, not in the rendered article.
  for (const line of text.replace(/^---\n[\s\S]*?\n---(?:\n|$)/, '').split('\n')) {
    if (line.startsWith('```mermaid') && showDiagramSource) {
      const block = codeBlock('mermaid');
      code = block.pre;
      language = 'mermaid';
      container.append(block.frame);
      continue;
    }
    if (line.startsWith('```mermaid')) {
      diagramSource = true;
      const hint = document.createElement('p');
      hint.textContent = 'Select a diagram step to read its detailed instructions.';
      container.append(hint);
      continue;
    }
    if (diagramSource) {
      if (line.startsWith('```')) diagramSource = false;
      continue;
    }
    if (line.startsWith('```')) {
      if (code) code = null;
      else {
        language = line.slice(3).trim().split(/\s/)[0].toLowerCase();
        const block = codeBlock(language);
        code = block.pre;
        container.append(block.frame);
      }
      table = null;
      continue;
    }
    if (code) {
      appendCode(code, line + '\n', language);
      continue;
    }
    const marker = line.match(/^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\](?:\s+(.*))?$/);
    if (marker) {
      callout = document.createElement('aside');
      callout.className = 'callout callout-' + marker[1].toLowerCase();
      callout.setAttribute('aria-label', marker[1].toLowerCase());
      const title = document.createElement('strong');
      title.className = 'callout-title';
      title.textContent = marker[2] || marker[1][0] + marker[1].slice(1).toLowerCase();
      callout.append(title);
      container.append(callout);
      lists = [];
      table = null;
      continue;
    }
    if (callout && /^>($| )/.test(line)) {
      if (line.length > 2) {
        const paragraph = document.createElement('p');
        inline(paragraph, line.slice(2), path, openRule);
        callout.append(paragraph);
      }
      continue;
    }
    callout = null;
    if (!line.trim()) {
      table = null;
      continue;
    }
    if (line.startsWith('|')) {
      if (/^\|[\s:|\-]+$/.test(line)) continue;
      const header = !table;
      if (!table) {
        table = document.createElement('table');
        const scroll = document.createElement('div');
        scroll.className = 'table-scroll';
        scroll.append(table);
        container.append(scroll);
      }
      const row = document.createElement('tr');
      for (const cell of line.slice(1, line.lastIndexOf('|')).split('|')) {
        const item = document.createElement(header ? 'th' : 'td');
        inline(item, cell.trim(), path, openRule);
        row.append(item);
      }
      table.append(row);
      continue;
    }
    table = null;
    const list = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (list) {
      const indent = list[1].length;
      const type = /\d/.test(list[2]) ? 'ol' : 'ul';
      while (lists.length && lists.at(-1).indent > indent) lists.pop();
      if (!lists.length || lists.at(-1).indent < indent || lists.at(-1).type !== type) {
        const node = document.createElement(type);
        const parent = lists.at(-1)?.node.lastElementChild ?? container;
        parent.append(node);
        lists.push({ indent, type, node });
      }
      const item = document.createElement('li');
      inline(item, list[3], path, openRule);
      lists.at(-1).node.append(item);
      continue;
    }
    lists = [];
    const heading = line.match(/^(#{1,6}) (.+)$/);
    const node = document.createElement(heading ? `h${heading[1].length}` : 'p');
    if (heading && heading[1].length === 1 && skipTitle) continue;
    if (heading) {
      const base = slug(heading[2]);
      const number = ids.get(base) ?? 0;
      ids.set(base, number + 1);
      node.id = number ? `${base}-${number}` : base;
    }
    if (/^\*\*(Activate|Scope|Read when|Use for)/.test(line)) node.classList.add('rule-lead');
    inline(node, heading?.[2] ?? line, path, openRule);
    container.append(node);
  }
  if (anchor) container.querySelector(`#${CSS.escape(anchor)}`)?.scrollIntoView({ block: 'start' });
}
