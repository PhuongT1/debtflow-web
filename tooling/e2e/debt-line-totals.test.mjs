import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

const source = new URL('../../apps/shell/src/', import.meta.url);
async function transpile(file) {
  return ts.transpileModule(await readFile(new URL(file, source), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
}

const moduleUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`;
const decimalModule = moduleUrl(await transpile('lib/forms/decimal.ts'));
const { sumDebtLineAmounts } = await import(
  moduleUrl(
    (await transpile('features/debts/forms/debt/line-item-totals.ts')).replace(
      '@/lib/forms/decimal',
      decimalModule,
    ),
  )
);
const { MONEY_DECIMAL_PATTERN, normalizePositiveDecimal } = await import(decimalModule);

test('rounds each line half-up before totaling and preserves precision in the debt payload', () => {
  assert.equal(
    sumDebtLineAmounts([
      { quantity: '0.5', unitPrice: '0.01' },
      { quantity: '0.5', unitPrice: '0.01' },
    ]),
    '0.02',
  );
  assert.equal(
    sumDebtLineAmounts([{ quantity: '1', unitPrice: '9007199254740993.25' }]),
    '9007199254740993.25',
  );
});

test('represents incomplete lines as zero and rejects amounts outside the API precision', () => {
  assert.equal(sumDebtLineAmounts([{ quantity: '1', unitPrice: '' }]), '0.00');
  for (const input of ['0.001', '10000000000000000', '0', '1e2', '-1']) {
    assert.equal(normalizePositiveDecimal(input, MONEY_DECIMAL_PATTERN), null);
  }
  assert.equal(normalizePositiveDecimal('+0001.20', MONEY_DECIMAL_PATTERN), '1.20');
});
