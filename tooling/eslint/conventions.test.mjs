import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ESLint } from 'eslint';

const root = new URL('../../', import.meta.url).pathname;
const cases = [
  { cwd: root, file: 'packages/ui/react/src/components/example.tsx' },
  { cwd: `${root}apps/shell`, file: 'src/components/example.tsx' },
  { cwd: `${root}apps/partner-ops`, file: 'src/features/parties/form/example.tsx' },
];
for (const { cwd, file } of cases) {
  const lint = new ESLint({ cwd });
  test(`${file}: library imports precede shared and app code`, async () => {
    const [bad] = await lint.lintText(
      "import { Input } from '@packages/ui-react';\nimport { useState } from 'react';\nexport const api = [Input, useState];",
      { filePath: file },
    );
    assert.ok(bad.messages.some(({ ruleId }) => ruleId === 'simple-import-sort/imports'));
  });
  test(`${file}: visual tokens cannot bypass the theme`, async () => {
    const [bad] = await lint.lintText(
      "import { designTokens } from '@packages/ui-tokens';\nexport const shadow = designTokens.shadow.dialog;",
      { filePath: file },
    );
    assert.ok(bad.messages.some(({ ruleId }) => ruleId === 'ui-conventions/theme-ownership'));
  });
  test(`${file}: the 230-line limit includes comments and whitespace`, async () => {
    const [bad] = await lint.lintText('export const value = 1;\n' + '// boundary\n'.repeat(230), {
      filePath: file,
    });
    assert.ok(bad.messages.some(({ ruleId }) => ruleId === 'max-lines'));
  });
}
