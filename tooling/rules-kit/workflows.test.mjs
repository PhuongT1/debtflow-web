import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { exportRules } from './export.mjs';
import { syncWorkflows } from './workflows.mjs';

const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const run = promisify(execFile);
const readSelector = (root) => readFile(join(root, '.ai-rules/README.md'), 'utf8');

async function addWorkflow(root, name, { priority = 85, when = 'Prepare a release' } = {}) {
  const folder = join(root, '.ai-rules/core/workflows', name);
  await mkdir(folder, { recursive: true });
  await writeFile(
    join(folder, 'README.md'),
    `# Release\n\n**Workflow kind:** entry\n**Select when:** ${when}\n**Selection priority:** ${priority}\n\nUse the current project release contract.\n`,
  );
}

test('repository selector matches the workflow entries on disk', async () => {
  await syncWorkflows(repository, { check: true });
});

test('adopted CLI handles additions, updates, removals and preserves authored instructions', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'workflow-adoption-'));
  try {
    const root = await exportRules(join(temporary, 'project'));
    const before = await readSelector(root);
    const prefix = before.split('<!-- workflow-selector:start -->')[0];
    const suffix = before.split('<!-- workflow-selector:end -->')[1];
    await addWorkflow(root, 'release');
    await assert.rejects(syncWorkflows(root, { check: true }), /stale/);
    assert.equal(await readSelector(root), before, 'check must not write');
    await run(process.execPath, ['tooling/rules-kit/workflows.mjs', '--write'], { cwd: root });
    let text = await readSelector(root);
    assert.ok(text.indexOf('workflows/feature-change/') < text.indexOf('workflows/release/'));
    assert.ok(text.indexOf('workflows/release/') < text.indexOf('workflows/rule-maintenance/'));
    assert.ok(text.startsWith(prefix));
    assert.ok(text.endsWith(suffix));
    await addWorkflow(root, 'release', { priority: 25, when: 'Publish an authorized release' });
    await syncWorkflows(root);
    text = await readSelector(root);
    assert.match(text, /Publish an authorized release/);
    assert.ok(text.indexOf('workflows/release/') < text.indexOf('workflows/ui/'));
    await rm(join(root, '.ai-rules/core/workflows/release'), { recursive: true });
    await assert.rejects(syncWorkflows(root, { check: true }), /stale/);
    await syncWorkflows(root);
    assert.equal(await readSelector(root), before, 'removal restores the original selection');
    await run(process.execPath, ['tooling/rules-kit/workflows.mjs', '--check'], { cwd: root });
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('invalid or ambiguous workflow metadata fails without rewriting the selector', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'workflow-invalid-'));
  try {
    const root = await exportRules(join(temporary, 'project'));
    const before = await readSelector(root);
    await addWorkflow(root, 'release', { priority: 30 });
    await assert.rejects(syncWorkflows(root), /Duplicate workflow selection priority/);
    await addWorkflow(root, 'release', { priority: 'later' });
    await assert.rejects(syncWorkflows(root), /Invalid workflow selection metadata/);
    await writeFile(join(root, '.ai-rules/core/workflows/release/README.md'), '# Release\n');
    await assert.rejects(syncWorkflows(root), /Declare Workflow kind/);
    await writeFile(
      join(root, '.ai-rules/core/workflows/release/README.md'),
      '# Release\n\n**Workflow kind:** group\n',
    );
    await syncWorkflows(root, { check: true });
    assert.equal(await readSelector(root), before);
    await writeFile(
      join(root, '.ai-rules/README.md'),
      before.replace('<!-- workflow-selector:end -->', ''),
    );
    await assert.rejects(syncWorkflows(root), /marker pair/);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('docs render added/removed sources while synchronization remains an explicit operation', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'workflow-viewer-'));
  try {
    const root = await exportRules(join(temporary, 'project'), { withViewer: true });
    const before = await readSelector(root);
    const clientPath = join(root, '.agents/skills/engineering-bug-fix/SKILL.md');
    const manifest = await readFile(join(root, '.ai-rules/.toolkit-generated.json'), 'utf8');
    await writeFile(clientPath, 'local client edit: docs must not overwrite or block on this\n');
    await addWorkflow(root, 'release');
    await run(process.execPath, ['tooling/rules-viewer/build.mjs'], { cwd: root });
    assert.equal(await readSelector(root), before, 'docs must not regenerate source instructions');
    assert.equal(
      await readFile(clientPath, 'utf8'),
      'local client edit: docs must not overwrite or block on this\n',
    );
    assert.equal(await readFile(join(root, '.ai-rules/.toolkit-generated.json'), 'utf8'), manifest);
    await assert.rejects(syncWorkflows(root, { check: true }), /stale/);
    await syncWorkflows(root);
    await run(process.execPath, ['tooling/rules-viewer/build.mjs'], { cwd: root });
    const data = JSON.parse(await readFile(join(root, 'dist/docs/data/documents.json'), 'utf8'));
    const path = '.ai-rules/core/workflows/release/README.md';
    assert.equal(data.filter((page) => page.path === path).length, 1);
    assert.equal(
      data.find((page) => page.path === path).text,
      await readFile(join(root, path), 'utf8'),
    );
    assert.equal(
      data.find((page) => page.path === '.ai-rules/README.md').text,
      await readSelector(root),
    );
    await readFile(join(root, 'dist/docs/rules/core/workflows/release/index.html'));
    await rm(join(root, '.ai-rules/core/workflows/release'), { recursive: true });
    await syncWorkflows(root);
    await run(process.execPath, ['tooling/rules-viewer/build.mjs'], { cwd: root });
    const updated = JSON.parse(await readFile(join(root, 'dist/docs/data/documents.json'), 'utf8'));
    assert.ok(!updated.some((page) => page.path === path));
    assert.doesNotMatch(await readSelector(root), /workflows\/release\//);
    await assert.rejects(
      readFile(join(root, 'dist/docs/rules/core/workflows/release/index.html')),
      {
        code: 'ENOENT',
      },
    );
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
