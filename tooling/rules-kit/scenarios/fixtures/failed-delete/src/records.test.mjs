import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deleteRecord } from './records.mjs';

test('a failed request preserves the list and exposes the error', async () => {
  const records = [{ id: 1 }, { id: 2 }];
  const result = await deleteRecord(records, 1, async () => {
    throw new Error('offline');
  });
  assert.deepEqual(result.records, records);
  assert.equal(result.error, 'Delete failed');
});

test('success removes exactly the requested record', async () => {
  const records = [{ id: 1 }, { id: 2 }];
  const result = await deleteRecord(records, 1, async () => {});
  assert.deepEqual(result.records, [{ id: 2 }]);
  assert.equal(result.error, null);
  assert.equal(records.length, 2);
});
