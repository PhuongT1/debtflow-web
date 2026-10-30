import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';
import { readFile, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const app = join(root, 'apps/partner-ops');

test('view lint rejects HTTP imports, fetch, inline keys and user status strings', async () => {
  const lint = new ESLint({ cwd: app });
  const [result] = await lint.lintText(
    `
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { partyService } from '@/services/parties/party.service';
export const bad = { queryKey: ['parties'], queryFn: () => fetch('/api/parties') };
export const active = 'ACTIVE';
export const client = [axios, useQuery, partyService];
`,
    { filePath: join(app, 'src/features/parties/list/example.tsx') },
  );
  const boundaryErrors = result.messages.filter((message) =>
    ['no-restricted-imports', 'no-restricted-syntax'].includes(message.ruleId),
  );
  assert.equal(boundaryErrors.length, 6);
  const [good] = await lint.lintText(
    `
import type { PartyListParams } from '@/services/parties/party.types';

import { useParties } from '../hooks/use-parties';
export function useExample(params: PartyListParams) { return useParties(params); }
`,
    { filePath: join(app, 'src/features/parties/list/example.tsx') },
  );
  assert.equal(good.errorCount, 0, JSON.stringify(good.messages));
});

async function loadPure(source) {
  const text = await readFile(join(app, 'src', source), 'utf8');
  const compiled = ts.transpileModule(text, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const temporary = await mkdtemp(join(root, 'node_modules/.party-contract-'));
  try {
    const file = join(temporary, 'module.mjs');
    await writeFile(file, compiled);
    return await import(pathToFileURL(file).href);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
}

test('query identity ignores URL order/unknown fields and preserves invalidation prefixes', async () => {
  const { getPartyListFilters, normalizePartyListFilters } = await loadPure(
    'features/parties/model/party-filters.ts',
  );
  const { queryKeys } = await loadPure('lib/query/query-keys.ts');
  const a = getPartyListFilters(new URLSearchParams('page=2&q=shop&noise=ignored'));
  const b = getPartyListFilters(new URLSearchParams('q=shop&page=2'));
  assert.deepEqual(queryKeys.parties.list(a), queryKeys.parties.list(b));
  assert.notDeepEqual(queryKeys.parties.list(a), queryKeys.parties.list({ ...a, page: '3' }));
  assert.deepEqual(
    queryKeys.parties.list(normalizePartyListFilters({})),
    queryKeys.parties.list(normalizePartyListFilters({ page: '1', pageSize: '20' })),
  );
  assert.deepEqual(queryKeys.parties.detail('partner-id').slice(0, 1), queryKeys.parties.all);
  assert.deepEqual(queryKeys.parties.list(a).slice(0, 1), queryKeys.parties.all);
});

test('transport errors preserve field failures and use locale-independent fallback identifiers', async () => {
  const { normalizeApiError, getApiErrorMessage } = await loadPure('lib/api/api-error.ts');
  const session = normalizeApiError({}, 401);
  assert.equal(
    getApiErrorMessage(session, (key) => `translated:${key}`),
    'translated:sessionExpired',
  );
  const invalid = normalizeApiError(
    {
      message: 'Validation failed',
      errors: [{ field: 'name', message: 'Required', code: 'required' }],
    },
    422,
  );
  assert.deepEqual(invalid.fieldErrors, [{ field: 'name', message: 'Required', code: 'required' }]);
  assert.equal(invalid.status, 422);
  assert.equal(normalizeApiError({}, 0, true).messageKey, 'timeout');
  assert.equal(normalizeApiError({}, 0).messageKey, 'networkError');
});

test('feature UI contains no Vietnamese literals and both catalogs have matching keys', async () => {
  const { readdir } = await import('node:fs/promises');
  async function walk(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const file = join(path, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.tsx?$/.test(file))
        assert.doesNotMatch(await readFile(file, 'utf8'), /[À-ỹ]/u, file);
    }
  }
  await walk(join(app, 'src/features/parties'));
  const keys = (value, prefix = '') =>
    Object.entries(value)
      .flatMap(([key, item]) =>
        typeof item === 'object' ? keys(item, prefix + key + '.') : [prefix + key],
      )
      .sort();
  const vi = JSON.parse(await readFile(join(app, 'messages/vi.json'), 'utf8'));
  const en = JSON.parse(await readFile(join(app, 'messages/en.json'), 'utf8'));
  assert.deepEqual(keys(vi), keys(en));
});

test('services cannot depend on feature UI or React query lifecycle', async () => {
  const lint = new ESLint({ cwd: app });
  const [result] = await lint.lintText(
    `
import { useMutation } from '@tanstack/react-query';
import type { PartyFormValues } from '@/features/parties/form/schema';
export const bad = useMutation;
export type BadParams = PartyFormValues;
`,
    { filePath: join(app, 'src/services/parties/example.ts') },
  );
  assert.equal(
    result.messages.filter((message) => message.ruleId === 'no-restricted-imports').length,
    2,
  );
});

test('form payload mapping omits blank optionals and server-only fields', async () => {
  const { toPartyRequest } = await loadPure('features/parties/form/to-party-request.ts');
  const request = toPartyRequest({
    type: 'CUSTOMER',
    name: 'Example',
    code: '',
    email: '',
    creditLimit: '0',
    id: 'response-only-id',
    balance: { receivable: 999 },
  });
  assert.deepEqual(JSON.parse(JSON.stringify(request)), {
    type: 'CUSTOMER',
    name: 'Example',
    creditLimit: '0',
  });
});

test('paginated responses preserve API metadata and reject missing/invalid metadata', async () => {
  const { parsePaginatedResponse } = await loadPure('lib/api/paginated-response.ts');
  const meta = {
    page: 2,
    pageSize: 10,
    total: 21,
    totalPages: 3,
    hasNextPage: true,
    hasPreviousPage: true,
  };
  const items = [{ id: 'party-1' }];
  assert.deepEqual(parsePaginatedResponse({ data: items, meta: { pagination: meta } }), {
    items,
    meta,
  });
  assert.deepEqual(
    parsePaginatedResponse({
      data: [],
      meta: {
        pagination: {
          ...meta,
          page: 1,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    }).items,
    [],
  );
  for (const body of [
    { data: items },
    { data: items, meta: { pagination: { ...meta, pageSize: 0 } } },
    { data: null, meta: { pagination: meta } },
  ]) {
    assert.throws(() => parsePaginatedResponse(body), /Invalid paginated/);
  }
});

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
