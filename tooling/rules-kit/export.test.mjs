import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm, access } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { test } from 'node:test';
import { exportRules } from './export.mjs';
import { fileURLToPath } from 'node:url';

async function markdownFiles(root) {
  const results = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) results.push(...(await markdownFiles(path)));
    else if (entry.name.endsWith('.md')) results.push(path);
  }
  return results;
}

test('export is self-contained and excludes the adopting project facts/source', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'portable-rules-'));
  try {
    const output = await exportRules(join(temporary, 'kit'));
    const files = await markdownFiles(output);
    assert.ok(files.length > 50);
    assert.deepEqual(await readdir(join(output, '.ai-rules/project')), ['README.md']);
    assert.deepEqual((await readdir(join(output, '.ai-rules'))).sort(), [
      '.toolkit-generated.json',
      'CATALOG.md',
      'README.md',
      'clients.json',
      'core',
      'project',
    ]);
    const sourceCore = resolve(dirname(fileURLToPath(import.meta.url)), '../../.ai-rules/core');
    const exportedCore = join(output, '.ai-rules/core');
    const sourceFiles = await markdownFiles(sourceCore);
    for (const file of sourceFiles) {
      const exported = join(exportedCore, file.slice(sourceCore.length + 1));
      assert.equal(await readFile(exported, 'utf8'), await readFile(file, 'utf8'), file);
    }
    assert.match(
      await readFile(join(output, '.ai-rules/project/README.md'), 'utf8'),
      /not configured/,
    );
    for (const file of files) {
      const text = await readFile(file, 'utf8');
      assert.doesNotMatch(
        text,
        /debtflow|@debtflow|apps\/(shell|partner-ops|payments)|port 300[012]/i,
        file,
      );
      for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)|click\s+\w+\s+"([^"]+)"/g)) {
        const link = match[1] ?? match[2];
        if (/^[a-z]+:/i.test(link)) continue;
        const [name] = link.split('#');
        if (!name) continue;
        const target = resolve(dirname(file), name);
        assert.ok(target.startsWith(output + '/'), `${file}: ${link}`);
        await assert.doesNotReject(access(target), `${file}: ${link}`);
      }
    }
    await assert.rejects(exportRules(output), /already exists/);
    assert.match(await readFile(join(output, 'README.md'), 'utf8'), /adoption kit/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
