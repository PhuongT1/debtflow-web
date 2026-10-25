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
    for (const match of page.text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)|click\s+\w+\s+"([^"]+)"/g)) {
      const link = match[1] ?? match[2];
      if (/^[a-z]+:/i.test(link)) continue;
      const [name, anchor] = link.split('#');
      if (name && !name.endsWith('.md')) continue;
      const path = name
        ? resolve(repository, dirname(page.path), name)
        : resolve(repository, page.path);
      await assert.doesNotReject(access(path), `${page.path}: ${link}`);
      if (anchor) {
        const text = await readFile(path, 'utf8');
        const headings = [...text.matchAll(/^#{1,6} (.+)$/gm)].map((match) => slug(match[1]));
        assert.ok(headings.includes(anchor), `${page.path}: ${link}`);
      }
      checked++;
    }
  }
  assert.ok(checked > 100);
});
