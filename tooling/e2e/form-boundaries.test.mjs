import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

async function loadModule(file, dependencies = {}) {
  const source = await readFile(new URL('../../' + file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  runInNewContext(outputText, { exports, require: (name) => dependencies[name] });
  return exports;
}

const { isFormFieldPath } = await loadModule(
  'packages/ui/react/src/components/form/field-errors.ts',
);

test('field paths accept real nested fields and reject unknown/prototype paths', () => {
  const values = { name: '', optional: undefined, items: [{ quantity: '' }] };
  for (const field of ['name', 'optional', 'items.0.quantity'])
    assert.equal(isFormFieldPath(values, field), true, field);
  for (const field of ['', 'missing', 'items.1.quantity', '__proto__.name', 'constructor.name'])
    assert.equal(isFormFieldPath(values, field), false, field);
});

for (const [app, path, errorModule] of [
  ['shell', 'lib/forms/errors.ts', '@/lib/api/client'],
  ['partner-ops', 'lib/form-errors.ts', '@/lib/api/api-error'],
]) {
  test(`${app} routes unsupported API fields to a visible form-level error`, async () => {
    class ApiClientError extends Error {
      fieldErrors = [
        { field: 'name', message: 'Name is required' },
        { field: 'unrecognized.field', message: 'Record could not be saved' },
        { field: '__proto__.polluted', message: 'Invalid field' },
      ];
    }
    const { applyApiFieldErrors } = await loadModule(`apps/${app}/src/${path}`, {
      '@packages/ui-react': { isFormFieldPath },
      [errorModule]: { ApiClientError },
    });
    const assigned = [];
    applyApiFieldErrors(new ApiClientError(), (field) => assigned.push(field), { name: '' });
    assert.deepEqual(assigned, ['name', 'root.server', 'root.server']);
    assert.equal({}.polluted, undefined);
  });
}
