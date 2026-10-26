import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { listDocuments } from './library.mjs';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^\w\- ]/g, '')
    .replaceAll(' ', '-');

test('canonical documents have one title and valid Markdown/diagram links after moves', async () => {
  const pages = await listDocuments(repository);
  let checked = 0;
  for (const page of pages) {
    const article = page.text.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
    assert.equal([...article.matchAll(/^# .+$/gm)].length, 1, page.path);
    const links = [
      ...[...article.matchAll(/\[(?:`[^`]*`|[^\]])+\]\((<[^>]+>|[^\s)]+)\)/g)].map(
        (match) => match[1],
      ),
      ...[...page.text.matchAll(/click\s+\w+\s+"([^"]+)"/g)].map((match) => match[1]),
    ];
    for (const link of links) {
      if (/^[a-z]+:/i.test(link)) continue;
      const [name, anchor] = link.replace(/^<|>$/g, '').split('#');
      if (name && !/\.(?:md|tsx?|[cm]?js|json|prisma|ya?ml|s?css|svg|png|jpe?g|webp)$/.test(name))
        continue;
      const path = name
        ? resolve(repository, dirname(page.path), name)
        : resolve(repository, page.path);
      await assert.doesNotReject(access(path), `${page.path}: ${link}`);
      if (anchor && (!name || name.endsWith('.md'))) {
        const text = await readFile(path, 'utf8');
        const headings = [...text.matchAll(/^#{1,6} (.+)$/gm)].map((match) => slug(match[1]));
        assert.ok(headings.includes(anchor), `${page.path}: ${link}`);
      }
      checked++;
    }
  }
  assert.ok(checked > 100);
});
