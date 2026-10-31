import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadPure } from './party-test-modules.mjs';
test('REST provider preserves operation, ID encoding, cancellation and payload contracts', async () => {
  const { createRestPartyService } = await loadPure('services/parties/providers/rest.ts');
  const calls = [];
  const meta = {
    page: 2,
    pageSize: 10,
    total: 21,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true,
  };
  const service = createRestPartyService({
    request: async (config) => {
      calls.push(config);
      return { id: 'party-1' };
    },
    requestPage: async (config) => {
      calls.push(config);
      return { items: [], meta };
    },
  });
  const signal = new AbortController().signal;
  const params = { page: '2', pageSize: '10' };
  assert.deepEqual(await service.list(params, signal), { items: [], meta });
  assert.deepEqual(calls[0], { url: '/parties', params, signal });
  await service.detail({ id: 'a/b' }, signal);
  assert.deepEqual(calls[1], { url: '/parties/a%2Fb', signal });
  const data = { name: 'Example', type: 'CUSTOMER' };
  await service.create({ data });
  await service.update({ id: 'a/b', data });
  await service.remove({ id: 'a/b' });
  assert.deepEqual(calls.slice(2), [
    { url: '/parties', method: 'POST', data },
    { url: '/parties/a%2Fb', method: 'PATCH', data },
    { url: '/parties/a%2Fb', method: 'DELETE' },
  ]);
  const failure = new Error('network');
  const failing = createRestPartyService({
    request: async () => {
      throw failure;
    },
  });
  await assert.rejects(failing.detail({ id: 'party-1' }), (error) => error === failure);
});
