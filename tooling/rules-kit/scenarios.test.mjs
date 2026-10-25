import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, writeFile, readFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { scenarios } from './scenarios/catalog.mjs';
import { prepareScenario } from './scenarios/prepare.mjs';
import { checkScenario } from './scenarios/check.mjs';

test('scenario catalog covers bug/UI/regression and approval boundaries with unique prompts', () => {
  assert.equal(new Set(scenarios.map((item) => item.id)).size, scenarios.length);
  assert.equal(new Set(scenarios.map((item) => item.prompt)).size, scenarios.length);
  for (const family of ['bug-fix', 'ui', 'scope-and-approval'])
    assert.ok(scenarios.some((item) => item.family === family));
  assert.ok(scenarios.some((item) => item.requiresApproval && item.allowedFiles.length === 0));
});

test('behavior check catches original failures, verifies fixes and rejects collateral edits', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'scenario-tests-'));
  try {
    for (const id of ['filter-reset', 'failed-delete']) {
      const prepared = await prepareScenario(id, join(temporary, id));
      const initial = await checkScenario(prepared.receipt);
      assert.equal(initial.scope.passed, true);
      assert.equal(typeof initial.behavior, 'object', 'The original regression must fail');
      const source = join(
        prepared.fixture,
        id === 'filter-reset' ? 'src/filters.mjs' : 'src/records.mjs',
      );
      const before = await readFile(source, 'utf8');
      const testPath = join(
        prepared.fixture,
        id === 'filter-reset' ? 'src/filters.test.mjs' : 'src/records.test.mjs',
      );
      const originalTests = await readFile(testPath, 'utf8');
      await writeFile(testPath, '// Disabled visible tests\n');
      assert.equal(
        typeof (await checkScenario(prepared.receipt)).behavior,
        'object',
        'Disabling visible tests must not hide the bug',
      );
      await writeFile(testPath, originalTests);
      const correction =
        id === 'filter-reset'
          ? before.replace(
              'return { ...state, partner };',
              'return { ...state, partner, page: 1 };',
            )
          : before.replace(
              "return { records: remaining, error: 'Delete failed' };",
              "return { records, error: 'Delete failed' };",
            );
      await writeFile(source, correction);
      const fixed = await checkScenario(prepared.receipt);
      assert.equal(fixed.behavior, 'passed');
      assert.equal(fixed.scope.passed, true);
      assert.equal(fixed.accepted, null, 'Code checks must not invent an agent review');
      await writeFile(
        join(prepared.fixture, 'src/unrelated.mjs'),
        'export const localPreference = "overwritten";',
      );
      await writeFile(
        join(prepared.fixture, 'src/new-abstraction.mjs'),
        'export const unused = true;',
      );
      await writeFile(join(prepared.fixture, '.ai-rules/README.md'), '# Disabled rules\n');
      const collateral = await checkScenario(prepared.receipt);
      assert.equal(collateral.scope.passed, false);
      assert.deepEqual(collateral.scope.unauthorized, [
        '.ai-rules/README.md',
        'src/new-abstraction.mjs',
        'src/unrelated.mjs',
      ]);
    }
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('UI checks stay pending without browser evidence; approval/plan cases forbid edits', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'scenario-gates-'));
  try {
    const ui = await prepareScenario('ui-actions', join(temporary, 'ui'));
    assert.equal((await checkScenario(ui.receipt)).behavior, 'browser-check-required');
    for (const id of ['ui-plan-only', 'shared-default-approval']) {
      const prepared = await prepareScenario(id, join(temporary, id));
      const initial = await checkScenario(prepared.receipt);
      assert.equal(initial.scope.passed, true);
      assert.equal(initial.accepted, null);
      assert.ok(initial.reviewRequired);
      await writeFile(join(prepared.fixture, 'src/unrelated.mjs'), 'changed');
      assert.equal((await checkScenario(prepared.receipt)).scope.passed, false);
    }
    await assert.rejects(prepareScenario('ui-actions', ui.fixture), /already exists/);
    await mkdir(join(ui.fixture, '.evaluation-artifacts'));
    await writeFile(join(ui.fixture, '.evaluation-artifacts/layout.png'), 'image fixture');
    assert.equal((await checkScenario(ui.receipt)).scope.passed, true);
    await writeFile(
      join(ui.fixture, '.evaluation-artifacts/hidden-code.mjs'),
      'export const hidden = true;',
    );
    assert.equal((await checkScenario(ui.receipt)).scope.passed, false);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
