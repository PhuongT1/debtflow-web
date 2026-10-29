import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contract, fakeWindow, loadSdk } from './overlay-test-helpers.mjs';
const { createOverlayHostBridge } = await loadSdk('host');
const { connectOverlaySurface } = await loadSdk('surface');

test('a prepared runtime serves multiple views without reloading or accepting stale results', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const sent = [];
  const surface = { postMessage: (message) => sent.push(message) };
  const runtimes = [];
  const opened = [];
  const finished = [];
  const host = createOverlayHostBridge({
    owner: { target: window.parent, origin: 'https://host.test' },
    views: { form: '/runtime', help: '/runtime' },
    baseUrl: 'https://host.test',
    getSurfaceWindow: () => surface,
    getLocale: () => 'en',
    onRuntime: (value) => runtimes.push(value),
    onOpen: (value) => opened.push(value),
    onPresent: () => {},
    onResize: () => {},
    onFinish: (value) => finished.push(value),
  });
  const receive = (id, type, extra = {}, source = surface) =>
    window.receive(
      { protocol: contract.OVERLAY_PROTOCOL, id, type, ...extra },
      'https://host.test',
      source,
    );
  try {
    assert.equal(runtimes.length, 1, 'Prepare before the first user click');
    host.attachSurface({ target: surface });
    receive(host.runtime.id, 'ready');
    const originalRuntime = host.runtime;
    receive('request-one', 'open', { request: { view: 'form', title: 'Form' } }, window.parent);
    assert.equal(sent.at(-1).type, 'init');
    receive('request-two', 'open', { request: { view: 'help', title: 'Help' } }, window.parent);
    assert.equal(
      window.sent.at(-1).message.result.status,
      'cancelled',
      'Rapid additional clicks do not produce false errors',
    );
    receive('request-one', 'presented', { height: 400 });
    receive('request-one', 'result', { result: { status: 'cancelled' } });
    host.complete({ result: finished.at(-1) });
    receive('request-three', 'open', { request: { view: 'help', title: 'Help' } }, window.parent);
    assert.equal(opened.length, 2);
    assert.equal(runtimes.length, 1);
    assert.equal(host.runtime, originalRuntime);
    assert.equal(sent.at(-1).id, 'request-three');
    receive('request-one', 'result', { result: { status: 'completed' } });
    assert.equal(finished.length, 1, 'Late messages from the old form cannot close a new dialog');
    receive('request-three', 'presented', { height: 200 });
    receive('request-three', 'result', {
      result: { status: 'completed', data: { selectedId: 'new-id' } },
    });
    host.complete({ result: finished.at(-1) });
    assert.equal(window.sent.at(-1).message.result.data.selectedId, 'new-id');
  } finally {
    host.dispose();
    globalThis.window = previous;
  }
});

test('retained content binds emissions to each request and drops old async callbacks', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const sessions = [];
  const surface = connectOverlaySurface({
    hostOrigin: 'https://host.test',
    id: 'runtime-one',
    onInit: (value) => sessions.push(value),
    onCloseRequest: () => {},
  });
  const init = (id, view) =>
    window.receive({
      protocol: contract.OVERLAY_PROTOCOL,
      id,
      type: 'init',
      request: { view, title: view },
    });
  try {
    init('first-request', 'form');
    assert.equal(surface.finish({ id: 'first-request', result: { status: 'cancelled' } }), true);
    init('second-request', 'help');
    const count = window.sent.length;
    assert.equal(surface.finish({ id: 'first-request', result: { status: 'completed' } }), false);
    assert.equal(window.sent.length, count);
    assert.equal(surface.present({ id: 'second-request', height: 200 }), true);
    assert.equal(window.sent.at(-1).message.id, 'second-request');
    assert.deepEqual(
      sessions.map((value) => value.id),
      ['first-request', 'second-request'],
    );
  } finally {
    surface.dispose();
    globalThis.window = previous;
  }
});
