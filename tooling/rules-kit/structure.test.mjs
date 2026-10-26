import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, resolve, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { listDocuments } from '../rules-viewer/library.mjs';
import { belongsToGroup, sections } from '../rules-viewer/sections.mjs';
import { discoverCapabilities } from './setup.mjs';
import { discoverWorkflows } from './workflows.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
async function markdown(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await markdown(path)));
    else if (entry.name.endsWith('.md')) result.push(path);
  }
  return result;
}

test('long prose policy blocks have one canonical owner', async () => {
  const owners = new Map();
  for (const file of await markdown(join(root, '.ai-rules'))) {
    const text = (await readFile(file, 'utf8')).replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
    for (const paragraph of text.split(/\n\s*\n/)) {
      // Structural headings, tables and tiny navigation/activation labels can repeat.
      if (paragraph.startsWith('|') || paragraph.trim().split(/\s+/).length < 40) continue;
      const key = paragraph.replace(/\s+/g, ' ').trim();
      assert.ok(
        !owners.has(key),
        `${relative(root, file)} repeats a policy block from ${owners.get(key)}`,
      );
      owners.set(key, relative(root, file));
    }
  }
});

test('every rule is indexed once and has its real source ancestry', async () => {
  const pages = await listDocuments(root);
  for (const file of await markdown(join(root, '.ai-rules'))) {
    const path = relative(root, file).split(sep).join('/');
    if (path.startsWith('.ai-rules/generated/')) continue;
    assert.equal(pages.filter((page) => page.path === path).length, 1, path);
    const groups = sections
      .flatMap((section) => section.groups)
      .filter((group) => belongsToGroup(path, group));
    assert.equal(groups.length, 1, path);
    assert.ok(path.startsWith(groups[0].root + '/'), path);
  }
  for (const framework of ['react', 'nextjs', 'angular']) {
    assert.ok(
      pages.some((page) => page.path === `.ai-rules/project/frameworks/${framework}/README.md`),
    );
  }
});

test('core skills select one primary workflow and cover every selectable workflow', async () => {
  const entries = await discoverWorkflows(root);
  const workflows = new Map(
    entries.map((entry) => [resolve(root, '.ai-rules/core/workflows', entry.path), []]),
  );
  const { skills } = await discoverCapabilities(root);
  for (const skill of skills.filter((item) => item.source.startsWith('.ai-rules/core/skills/'))) {
    const targets = new Set(
      [...skill.text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)]
        .map((match) => resolve(root, dirname(skill.source), match[1].split('#')[0]))
        .filter((target) => workflows.has(target)),
    );
    assert.equal(targets.size, 1, `${skill.source} must select one primary workflow entry`);
    for (const target of targets) workflows.get(target).push(skill.name);
  }
  for (const [workflow, names] of workflows)
    assert.ok(names.length > 0, `${relative(root, workflow)} has no core skill discovery entry`);
});
