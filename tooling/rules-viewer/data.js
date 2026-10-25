import { documentRoute } from './routes.mjs';
import { searchDocuments } from './search.mjs';

export const siteBase = new URL('.', import.meta.url).pathname;
const isStatic = document.querySelector('meta[name="docs-mode"]')?.content === 'static';
let staticDocuments;
async function documents() {
  staticDocuments ??= fetch(new URL('data/documents.json', import.meta.url)).then((response) => {
    if (!response.ok) throw new Error('Documentation data unavailable.');
    return response.json();
  });
  return staticDocuments;
}
async function json(path, signal) {
  const response = await fetch(siteBase + path, { signal });
  if (!response.ok) throw new Error('Document or search unavailable.');
  return response.json();
}
export async function loadPages() {
  return isStatic ? documents() : json('api/pages');
}
export async function loadDocument(path) {
  if (!isStatic) return json('api/document?path=' + encodeURIComponent(path));
  const result = (await documents()).find((page) => page.path === path);
  if (!result) throw new Error('Document unavailable.');
  return result;
}
export async function searchPages(query, signal) {
  if (!isStatic) return json('api/search?q=' + encodeURIComponent(query), signal);
  return searchDocuments(await documents(), query);
}
export function rawDocumentUrl(path) {
  return isStatic
    ? siteBase + 'raw/' + path
    : siteBase + 'api/raw?path=' + encodeURIComponent(path);
}
export const pageUrl = (path, anchor = '') =>
  documentRoute(path, siteBase) + (anchor ? '#' + anchor : '');
