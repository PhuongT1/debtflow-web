import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contract, fakeWindow, loadSdk } from './overlay-test-helpers.mjs';
const { createOverlayHostBridge } = await loadSdk('host');
const { connectOverlaySurface } = await loadSdk('surface');

test('host waits for presented layout and preserves result data until UI exit completes', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const surfaceMessages = [];
  const surface = { postMessage: (message, origin) => surfaceMessages.push({ message, origin }) };
  let session;
  let presentCount = 0;
  let result;
  const host = createOverlayHostBridge({
    owner: { target: window.parent, origin: 'https://remote.test' },
    views: { help: 'https://content.test/overlay/help' },
    baseUrl: 'https://host.test',
    getSurfaceWindow: () => surface,
    getLocale: () => 'en',
    onOpen: (value) => {
      session = value;
    },
    onPresent: () => presentCount++,
    onResize: () => {},
    onFinish: (value) => {
      result = value;
    },
  });
  const wire = (type, extra = {}) => ({
    protocol: contract.OVERLAY_PROTOCOL,
    id: 'host-test',
    type,
    ...extra,
  });
  try {
    window.receive(
      wire('open', { request: { view: 'help', title: 'Help' } }),
      'https://remote.test',
    );
    assert.ok(session.url.startsWith('https://content.test/overlay/help'));
    host.attachSurface({ target: surface });
    window.receive({ ...wire('ready'), id: host.runtime.id }, 'https://content.test', surface);
    assert.equal(presentCount, 0);
    assert.equal(surfaceMessages.at(-1).message.type, 'init');
    window.receive(wire('presented', { height: 400 }), 'https://content.test', surface);
    assert.equal(presentCount, 1);
    host.activate();
    assert.equal(surfaceMessages.at(-1).message.type, 'activate');
    window.receive(
      wire('result', { result: { status: 'completed', data: { id: 'saved-1' } } }),
      'https://content.test',
      surface,
    );
    assert.deepEqual(result.data, { id: 'saved-1' });
    assert.equal(window.sent.at(-1).message.type, 'accepted');
    host.complete({ result });
    assert.deepEqual(window.sent.at(-1).message.result.data, { id: 'saved-1' });
  } finally {
    host.dispose();
    globalThis.window = previous;
  }
});
test('content-side SDK supports non-React rendering, close guards and cleanup', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  let request;
  let closeCount = 0;
  let active = false;
  const surface = connectOverlaySurface({
    hostOrigin: 'https://host.test',
    id: 'surface-test',
    onInit: ({ request: value }) => {
      request = value;
    },
    onCloseRequest: () => closeCount++,
    onActivate: () => {
      active = true;
    },
  });
  const wire = (type, extra = {}) => ({
    protocol: contract.OVERLAY_PROTOCOL,
    id: 'surface-test',
    type,
    ...extra,
  });
  try {
    assert.equal(window.sent.at(-1).message.type, 'ready');
    window.receive(
      wire('init', { request: { view: 'help', title: 'Help', input: { id: 'item-1' } } }),
    );
    assert.equal(request.input.id, 'item-1');
    surface.present({ id: 'surface-test', height: 400 });
    assert.equal(window.sent.at(-1).message.type, 'presented');
    window.receive(wire('activate'));
    assert.equal(active, true);
    window.receive(wire('close-request'));
    assert.equal(closeCount, 1);
    // The framework's guard has not accepted closure yet: no result was emitted.
    assert.equal(window.sent.at(-1).message.type, 'presented');
    surface.finish({
      id: 'surface-test',
      result: { status: 'completed', data: { selectedId: 'item-1' } },
    });
    assert.equal(window.sent.at(-1).message.result.data.selectedId, 'item-1');
  } finally {
    surface.dispose();
    assert.equal(window.listeners.size, 0);
    globalThis.window = previous;
  }
});
