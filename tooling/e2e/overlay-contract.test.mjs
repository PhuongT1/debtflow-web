import assert from 'node:assert/strict';
import { test } from 'node:test';

import { contract, fakeWindow, loadSdk } from './overlay-test-helpers.mjs';
const { openPlatformOverlay } = await loadSdk('client');

test('overlay wire boundary rejects wrong versions, malformed results, oversized input and unbounded sizing', () => {
  const valid = {
    protocol: contract.OVERLAY_PROTOCOL,
    id: 'request-1',
    type: 'open',
    request: { view: 'party-form', title: 'Create' },
  };
  assert.equal(contract.isOverlayMessage(valid), true);
  for (const value of [
    null,
    { ...valid, protocol: 'v0' },
    { ...valid, id: '' },
    { ...valid, request: { ...valid.request, size: 'huge' } },
    { ...valid, request: { ...valid.request, input: { text: 'x'.repeat(17000) } } },
    { ...valid, type: 'resize', height: Infinity },
    { ...valid, type: 'result', result: { status: 'unknown' } },
    { ...valid, locale: 'invalid' },
  ])
    assert.equal(contract.isOverlayMessage(value), false);
});

test('SDK ignores spoofed windows/origins/IDs, resolves once and removes listeners', async () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  try {
    const promise = openPlatformOverlay({
      request: { view: 'help', title: 'Help' },
      hostOrigin: 'https://host.test',
    });
    const request = window.sent[0];
    assert.equal(request.origin, 'https://host.test');
    const response = {
      protocol: contract.OVERLAY_PROTOCOL,
      id: request.message.id,
      type: 'result',
      result: { status: 'completed' },
    };
    window.receive(response, 'https://evil.test');
    window.receive(response, 'https://host.test', {});
    window.receive({ ...response, id: 'another-request' });
    assert.equal(window.listeners.size, 1);
    window.receive({ ...response, type: 'accepted' });
    assert.equal(window.timers.size, 0);
    window.receive(response);
    assert.deepEqual(await promise, { status: 'completed' });
    assert.equal(window.listeners.size, 0);
  } finally {
    globalThis.window = previous;
  }
});
test('SDK timeout and owner unmount abort without opening a local duplicate', async () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  try {
    const promise = openPlatformOverlay({
      request: { view: 'help', title: 'Help' },
      hostOrigin: 'https://host.test',
    });
    [...window.timers.values()][0]();
    assert.deepEqual(await promise, { status: 'failed' });
    assert.equal(window.sent.at(-1).message.type, 'abort');
    assert.equal(window.listeners.size, 0);
    const controller = new AbortController();
    const pending = openPlatformOverlay({
      request: { view: 'help', title: 'Help' },
      hostOrigin: 'https://host.test',
      signal: controller.signal,
    });
    controller.abort();
    assert.deepEqual(await pending, { status: 'cancelled' });
    assert.equal(window.timers.size, 0);
    assert.equal(window.listeners.size, 0);
  } finally {
    globalThis.window = previous;
  }
});

test('input/result data permits JSON values but rejects functions, exotic objects and cycles', () => {
  const base = {
    protocol: contract.OVERLAY_PROTOCOL,
    id: 'data-test',
    type: 'result',
    result: {
      status: 'completed',
      data: { selectedIds: ['a', 'b'], count: 2, context: { enabled: true, optional: null } },
    },
  };
  assert.equal(contract.isOverlayMessage(base), true);
  const cyclic = {};
  cyclic.self = cyclic;
  for (const data of [
    { callback() {} },
    { date: new Date() },
    { value: undefined },
    { number: NaN },
    cyclic,
  ]) {
    assert.equal(contract.isOverlayMessage({ ...base, result: { ...base.result, data } }), false);
  }
});
