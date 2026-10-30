import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const urlFor = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const shell = new URL('../../apps/shell/src/', import.meta.url);
async function loadModule(file, dependencies) {
  let source = ts.transpileModule(await readFile(new URL(file, shell), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  for (const [specifier, mock] of Object.entries(dependencies)) {
    const url = urlFor(mock);
    source = source
      .replaceAll(`'${specifier}'`, `'${url}'`)
      .replaceAll(`"${specifier}"`, `"${url}"`);
  }
  return import(urlFor(source));
}

const mocks = {};
globalThis.__loginTestMocks = mocks;
const client = await loadModule('lib/auth/client.ts', {
  'next-auth/react':
    'export const signIn = (...args) => globalThis.__loginTestMocks.signIn(...args);',
});
const tokens = await loadModule('lib/auth/tokens.ts', {
  '@/services/auth':
    'export const authService = { refresh: (input) => globalThis.__loginTestMocks.refresh(input) };',
});
const navigation = await loadModule('lib/auth/login-navigation.ts', {
  'next/headers': 'export const headers = async () => new Headers();',
  '@packages/platform-sdk':
    'export const buildLoginUrl = (origin, value) => origin + "/login?callbackUrl=" + encodeURIComponent(value);',
  '@/lib/config/environment':
    'export const shellEnv = { AUTH_URL: "http://localhost:3000", AUTH_ALLOWED_RETURN_ORIGINS: "http://localhost:3000,http://localhost:3001,http://localhost:3002" };',
});
const { authService } = await loadModule('services/auth/auth.service.ts', {
  'server-only': 'export {};',
  '@/lib/api/http':
    'export const http = { post: (...args) => globalThis.__loginTestMocks.post(...args) };',
  '@/lib/api/response': 'export const unwrapApiResponse = body => body.data ?? body;',
  '@/lib/config/environment': 'export const API_URL = "http://api.test/api";',
});
const credentials = { email: 'member@example.test', password: 'test-password' };
const response = {
  accessToken: 'test-access',
  refreshToken: 'test-refresh',
  expiresIn: 900,
  user: { id: 'user-1', name: 'Member', email: credentials.email, systemRole: 'USER' },
  activeOrganization: {
    id: 'org-1',
    name: 'Shop',
    slug: 'shop',
    kind: 'BUSINESS',
    role: 'OWNER',
    membershipId: 'member-1',
  },
};

test('browser credentials adapter retains NextAuth CSRF/cookie flow and disables automatic redirects', async () => {
  const calls = [];
  mocks.signIn = async (...args) => {
    calls.push(args);
    return { ok: true };
  };
  assert.deepEqual(await client.signInWithCredentials(credentials), { success: true });
  assert.deepEqual(calls, [['credentials', { ...credentials, redirect: false }]]);
});

test('browser adapter distinguishes invalid credentials from unavailable authentication', async () => {
  for (const [result, error] of [
    [{ ok: false, error: 'CredentialsSignin' }, 'CredentialsSignin'],
    [undefined, 'Configuration'],
    [{ ok: false }, 'Configuration'],
  ]) {
    mocks.signIn = async () => result;
    assert.deepEqual(await client.signInWithCredentials(credentials), { success: false, error });
  }
  mocks.signIn = async () => {
    throw new Error('Network failure');
  };
  assert.deepEqual(await client.signInWithCredentials(credentials), {
    success: false,
    error: 'Configuration',
  });
});

test('auth service serializes login and refresh requests once through the existing transport', async () => {
  const calls = [];
  mocks.post = async (...args) => {
    calls.push(args);
    return { ok: true, json: async () => ({ data: response }) };
  };
  assert.deepEqual(await authService.login(credentials), response);
  assert.deepEqual(await authService.refresh({ refreshToken: 'test-refresh' }), response);
  assert.deepEqual(
    calls.map(([url, body, options]) => ({ url, body: JSON.parse(body), options })),
    [
      {
        url: 'http://api.test/api/auth/login',
        body: credentials,
        options: { headers: { 'Content-Type': 'application/json' } },
      },
      {
        url: 'http://api.test/api/auth/refresh',
        body: { refreshToken: 'test-refresh' },
        options: { headers: { 'Content-Type': 'application/json' } },
      },
    ],
  );
});

test('failed backend authentication never becomes a successful auth payload', async () => {
  mocks.post = async () => ({
    ok: false,
    json: () => {
      throw new Error('Must not parse rejected authentication');
    },
  });
  assert.equal(await authService.login(credentials), null);
  assert.equal(await authService.refresh({ refreshToken: 'invalid' }), null);
});

test('token expiration respects explicit expiration, duration and the existing fallback', () => {
  assert.equal(
    tokens.getAccessTokenExpiresAt({ accessTokenExpiresAt: 1234, expiresIn: 999, now: 0 }),
    1234,
  );
  assert.equal(tokens.getAccessTokenExpiresAt({ expiresIn: 900, now: 1000 }), 901000);
  assert.equal(tokens.getAccessTokenExpiresAt({ now: 1000 }), 901000);
});

test('authenticated user retains the active organization and tokens', () => {
  const mapped = tokens.mapAuthUser({ result: { ...response, accessTokenExpiresAt: 1000 } });
  assert.equal(mapped.id, response.user.id);
  assert.equal(mapped.organization, response.activeOrganization);
  assert.equal(mapped.role, 'OWNER');
  assert.equal(mapped.accessTokenExpiresAt, 1000);
});

test('refresh rotates tokens without losing identity or organization context', async () => {
  const token = {
    sub: 'user-1',
    refreshToken: 'old-refresh',
    role: 'VIEWER',
    organization: { id: 'old-org' },
  };
  mocks.refresh = async (input) => {
    assert.deepEqual(input, { refreshToken: 'old-refresh' });
    return { ...response, accessTokenExpiresAt: 2000 };
  };
  const refreshed = await tokens.refreshAccessToken({ token });
  assert.equal(refreshed.sub, token.sub);
  assert.equal(refreshed.accessToken, 'test-access');
  assert.equal(refreshed.refreshToken, 'test-refresh');
  assert.equal(refreshed.organization.id, 'org-1');
  assert.equal(refreshed.role, 'OWNER');
  assert.equal(refreshed.error, undefined);
});

test('refresh failures preserve the token identity and mark the session unusable', async () => {
  for (const result of [null, {}]) {
    mocks.refresh = async () => result;
    assert.equal(
      (await tokens.refreshAccessToken({ token: { sub: 'user-1', refreshToken: 'invalid' } }))
        .error,
      'RefreshTokenError',
    );
  }
  mocks.refresh = async () => {
    throw new Error('Unavailable');
  };
  assert.equal(
    (await tokens.refreshAccessToken({ token: { refreshToken: 'invalid' } })).error,
    'RefreshTokenError',
  );
  assert.equal((await tokens.refreshAccessToken({ token: { sub: 'user-1' } })).sub, 'user-1');
});

test('return destinations preserve approved app paths and reject unsafe origins and auth loops', () => {
  assert.equal(
    navigation.resolveLoginReturnTo({ value: '/parties?page=2#list' }),
    '/parties?page=2#list',
  );
  assert.equal(
    navigation.resolveLoginReturnTo({ value: 'http://localhost:3001/parties?q=test#list' }),
    'http://localhost:3001/parties?q=test#list',
  );
  for (const value of [
    undefined,
    '//evil.test',
    'https://evil.test/path',
    'javascript:alert(1)',
    '/api/auth/session',
    '/%6cogin',
    '/_next/assets',
    'http://user:password@localhost:3001/parties',
  ]) {
    assert.equal(navigation.resolveLoginReturnTo({ value }), '/', String(value));
  }
});
