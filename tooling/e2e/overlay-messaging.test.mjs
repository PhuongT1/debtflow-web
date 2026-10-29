import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contract, fakeWindow, loadMessaging, loadMessengerCopy } from './overlay-test-helpers.mjs';
const { createPlatformClient } = await loadMessaging('platform-client');
const { createRemoteClient } = await loadMessaging('remote-client');

test('one app instance routes navigation, locale and concurrent overlays through one native listener', async () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const client = createPlatformClient({
    source: 'partner-ops',
    getHostOrigin: () => 'https://host.test',
  });
  const locales = [];
  const routes = [];
  const stop = client.listen({
    onLocale: (value) => locales.push(value),
    onRoute: (value) => routes.push(value),
  });
  const firstController = new AbortController();
  const secondController = new AbortController();
  try {
    client.navigate({ path: '/payments?partyId=p-1' });
    assert.equal(window.sent.at(-1).message.type, 'debtflow:navigate');
    assert.equal(window.sent.at(-1).message.source, 'partner-ops');
    client.announceReady({ capabilities: [contract.MFE_ROUTE_SYNC_CAPABILITY] });
    assert.equal(window.sent.at(-1).message.type, 'debtflow:ready');
    const first = client.openOverlay({
      request: { view: 'help', title: 'Help' },
      signal: firstController.signal,
    });
    const firstId = window.sent.at(-1).message.id;
    const second = client.openOverlay({
      request: { view: 'help', title: 'Help again' },
      signal: secondController.signal,
    });
    const secondId = window.sent.at(-1).message.id;
    assert.notEqual(firstId, secondId);
    assert.equal(window.listeners.size, 1, 'Subscriptions must share the native dispatcher');
    const locale = {
      source: 'platform',
      version: 1,
      type: 'debtflow:locale-changed',
      locale: 'en',
    };
    window.receive(locale, 'https://evil.test');
    window.receive({ ...locale, source: 'other-app' });
    window.receive(locale);
    window.receive({
      source: 'platform',
      version: 1,
      type: 'debtflow:route-changed',
      path: '/__embed/parties?page=2',
    });
    assert.deepEqual(locales, [{ locale: 'en' }]);
    assert.deepEqual(routes, [{ path: '/__embed/parties?page=2' }]);
    stop();
    stop();
    assert.equal(
      window.listeners.size,
      1,
      'Removing route handlers must not remove active overlay subscriptions',
    );
    window.receive({
      protocol: contract.OVERLAY_PROTOCOL,
      id: firstId,
      type: 'result',
      result: { status: 'completed', data: { id: 'p-1' } },
    });
    assert.equal((await first).data.id, 'p-1');
    assert.equal(window.listeners.size, 1);
    secondController.abort();
    assert.equal((await second).status, 'cancelled');
    assert.equal(window.listeners.size, 0);
  } finally {
    firstController.abort();
    secondController.abort();
    stop();
    globalThis.window = previous;
  }
});

test('standalone navigation uses configured host and rejects unsafe paths', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  window.parent = window;
  const locations = [];
  window.location = { assign: (url) => locations.push(url) };
  globalThis.window = window;
  try {
    const client = createPlatformClient({
      source: 'partner-ops',
      getHostOrigin: () => 'https://host.test',
    });
    assert.equal(client.isEmbedded(), false);
    assert.equal(client.navigate({ path: '//evil.test' }), false);
    assert.equal(client.navigate({ path: '/\\evil' }), false);
    assert.equal(client.navigate({ path: '/payments?partyId=1' }), true);
    client.announceReady({ capabilities: [] });
    assert.deepEqual(locations, ['https://host.test/payments?partyId=1']);
    assert.equal(window.sent.length, 0);
  } finally {
    globalThis.window = previous;
  }
});

test('Shell remote instance filters app/version and centralizes route/locale replies', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const ready = [];
  const navigate = [];
  const remote = createRemoteClient({
    source: 'partner-ops',
    getPeer: () => ({ target: window.parent, origin: 'https://host.test' }),
  });
  const stop = remote.listen({
    onReady: (value) => ready.push(value),
    onNavigate: (value) => navigate.push(value),
  });
  try {
    window.receive({ source: 'another', version: 1, type: 'debtflow:ready', capabilities: [] });
    window.receive({ source: 'partner-ops', version: 0, type: 'debtflow:ready', capabilities: [] });
    window.receive({
      source: 'partner-ops',
      version: 1,
      type: 'debtflow:ready',
      capabilities: ['route-sync-v1'],
    });
    window.receive({
      source: 'partner-ops',
      version: 1,
      type: 'debtflow:navigate',
      path: '/parties?page=2',
    });
    window.receive({ source: 'partner-ops', version: 1, type: 'debtflow:ready' });
    assert.deepEqual(ready, [{ capabilities: ['route-sync-v1'] }, { capabilities: [] }]);
    assert.deepEqual(navigate, [{ path: '/parties?page=2' }]);
    remote.setLocale({ locale: 'vi' });
    assert.equal(window.sent.at(-1).message.type, 'debtflow:locale-changed');
    remote.setRoute({ path: '/__embed/parties?page=2' });
    assert.equal(window.sent.at(-1).message.type, 'debtflow:route-changed');
    assert.equal(window.listeners.size, 1);
  } finally {
    stop();
    globalThis.window = previous;
  }
});

test('independent SDK bundles in the same window share the global dispatcher', async () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const firstModule = await loadMessaging('window-messenger');
  const secondModule = await loadMessengerCopy();
  const options = {
    getPeer: () => ({ target: window.parent, origin: 'https://host.test' }),
    validate: contract.isOverlayMessage,
  };
  let calls = 0;
  const first = firstModule.createWindowMessenger(options).listen({ handler: () => calls++ });
  const second = secondModule.createWindowMessenger(options).listen({ handler: () => calls++ });
  try {
    assert.equal(window.listeners.size, 1);
    window.receive({ protocol: contract.OVERLAY_PROTOCOL, id: 'test-bundles', type: 'ready' });
    assert.equal(calls, 2);
    first();
    assert.equal(window.listeners.size, 1);
    second();
    assert.equal(window.listeners.size, 0);
  } finally {
    first();
    second();
    globalThis.window = previous;
  }
});

test('a late host can request readiness again without remounting the remote', () => {
  const previous = globalThis.window;
  const window = fakeWindow();
  globalThis.window = window;
  const client = createPlatformClient({
    source: 'partner-ops',
    getHostOrigin: () => 'https://host.test',
  });
  const stop = client.listen({ onLocale() {}, onRoute() {} });
  const request = { source: 'platform', version: 1, type: 'debtflow:ready-request' };
  try {
    window.receive(request);
    assert.equal(window.sent.length, 0, 'Never announce before application readiness');
    client.announceReady({ capabilities: [contract.MFE_ROUTE_SYNC_CAPABILITY] });
    window.sent.length = 0;
    window.receive(request, 'https://evil.test');
    window.receive({ ...request, version: 999 });
    assert.equal(window.sent.length, 0);
    window.receive(request);
    assert.equal(window.sent.at(-1)?.message.type, 'debtflow:ready');
    assert.deepEqual(window.sent.at(-1).message.capabilities, [contract.MFE_ROUTE_SYNC_CAPABILITY]);
    const remote = createRemoteClient({
      source: 'partner-ops',
      getPeer: () => ({ target: window.parent, origin: 'https://host.test' }),
    });
    remote.requestReady();
    assert.deepEqual(window.sent.at(-1).message, request);
  } finally {
    stop();
    globalThis.window = previous;
  }
});
