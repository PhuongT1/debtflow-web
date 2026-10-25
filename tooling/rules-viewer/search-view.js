import { searchPages } from './data.js';
import { docUrl } from './navigation.js';
import { sections } from './sections.mjs';

export function setupSearch(openRule) {
  const dialog = document.querySelector('#search-dialog');
  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  let timeout;
  let controller;
  let version = 0;
  const show = () => {
    dialog.showModal();
    input.focus();
  };
  document.querySelector('#search-open').addEventListener('click', show);
  document.querySelector('#search-close').addEventListener('click', () => dialog.close());
  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (!dialog.open) show();
    }
  });
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    controller?.abort();
    const current = ++version;
    const query = input.value.trim();
    results.replaceChildren();
    if (!query) {
      status.textContent = 'Try “approval”, “component”, or “UI”.';
      return;
    }
    status.textContent = 'Searching…';
    timeout = setTimeout(async () => {
      controller = new AbortController();
      try {
        const matches = await searchPages(query, controller.signal);
        if (current !== version) return;
        status.textContent = matches.length
          ? `${matches.length} results`
          : 'No results. Try another term or file path.';
        for (const item of matches) {
          const link = document.createElement('a');
          link.href = docUrl(item.path);
          const title = document.createElement('strong');
          title.textContent = item.title;
          const path = document.createElement('small');
          path.textContent = `${sections.find((section) => section.id === item.section)?.title ?? 'Documentation'} · ${item.path}`;
          const snippet = document.createElement('span');
          snippet.textContent = item.snippet;
          link.append(title, path, snippet);
          link.addEventListener('click', (event) => {
            event.preventDefault();
            dialog.close();
            openRule(item.path, '');
          });
          results.append(link);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && current === version) status.textContent = error.message;
      }
    }, 150);
  });
  dialog.addEventListener('keydown', (event) => {
    const links = [...results.querySelectorAll('a')];
    const index = links.indexOf(document.activeElement);
    if (event.key === 'ArrowDown' && links.length) {
      event.preventDefault();
      links[Math.min(index + 1, links.length - 1)].focus();
    }
    if (event.key === 'ArrowUp' && links.length) {
      event.preventDefault();
      (index <= 0 ? input : links[index - 1]).focus();
    }
    if (event.key === 'Enter' && document.activeElement === input && links.length) {
      event.preventDefault();
      links[0].click();
    }
  });
}
