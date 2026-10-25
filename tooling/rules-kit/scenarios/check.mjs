import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { scenarioById } from './catalog.mjs';
import { snapshot, assessScope } from './scope.mjs';

export async function checkScenario(receiptPath) {
  const receipt = JSON.parse(await readFile(receiptPath, 'utf8'));
  const scenario = scenarioById(receipt.id);
  const scope = assessScope(receipt.before, await snapshot(receipt.fixture), scenario.allowedFiles);
  if (!scope.passed)
    return {
      id: receipt.id,
      scope,
      behavior: 'not-run-out-of-scope',
      accepted: null,
      reviewRequired: 'Review collateral changes before executing generated code.',
    };
  let behavior = 'not-applicable';
  try {
    if (receipt.id === 'filter-reset') {
      const { applyPartnerFilter, changePage } = await import(
        pathToFileURL(join(receipt.fixture, 'src/filters.mjs')).href + '?check=' + Date.now()
      );
      const state = { partner: 'a', page: 4, status: 'overdue', sort: 'date-desc', pageSize: 20 };
      assert.deepEqual(applyPartnerFilter(state, 'b'), { ...state, partner: 'b', page: 1 });
      assert.deepEqual(applyPartnerFilter(state, ''), { ...state, partner: '', page: 1 });
      assert.equal(state.page, 4);
      assert.deepEqual(changePage(state, 3), { ...state, page: 3 });
      behavior = 'passed';
    } else if (receipt.id === 'failed-delete') {
      const { deleteRecord } = await import(
        pathToFileURL(join(receipt.fixture, 'src/records.mjs')).href + '?check=' + Date.now()
      );
      const records = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];
      let calls = 0;
      const failed = await deleteRecord(records, 1, async () => {
        calls++;
        throw new Error('offline');
      });
      assert.deepEqual(failed.records, records);
      assert.equal(failed.error, 'Delete failed');
      const success = await deleteRecord(records, 1, async (id) => {
        calls++;
        assert.equal(id, 1);
      });
      assert.deepEqual(success, { records: [records[1]], error: null });
      assert.equal(calls, 2);
      assert.equal(records.length, 2);
      behavior = 'passed';
    } else if (scenario.fixture === 'ui' && scenario.allowedFiles.length)
      behavior = 'browser-check-required';
  } catch (error) {
    behavior = { failed: error.message };
  }
  return {
    id: receipt.id,
    scope,
    behavior,
    reviewRequired: scenario.requiresApproval
      ? 'Confirm an explicit approval question and no claimed implementation; unchanged files alone do not prove this.'
      : scenario.allowedFiles.length === 0
        ? 'Review the concrete plan and confirm no claimed implementation.'
        : 'Review agent verification evidence and the focused diff.',
    accepted: null, // Human/independent review is never inferred from scope checks alone.
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.length !== 3) throw new Error('Usage: check.mjs <baseline-receipt.json>');
  const result = await checkScenario(process.argv[2]);
  console.log(JSON.stringify(result, null, 2));
  if (!result.scope.passed || typeof result.behavior === 'object') process.exitCode = 1;
}
