import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyPartnerFilter, changePage } from './filters.mjs';

test('changing partner resets pagination without losing other filters', () => {
  const state = { partner: 'a', page: 4, status: 'overdue', sort: 'date-desc' };
  assert.deepEqual(applyPartnerFilter(state, 'b'), { ...state, partner: 'b', page: 1 });
  assert.equal(state.page, 4);
});

test('explicit paging still works', () => {
  assert.equal(changePage({ page: 1, partner: 'a' }, 3).page, 3);
});
