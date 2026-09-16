import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';
import { createSharedLintConfig } from './tooling/eslint/shared.mjs';

export default tseslint.config(
  ...createSharedLintConfig(),
  {
    name: 'debtflow/packages',
    files: ['packages/**/*.{ts,tsx}'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  eslintConfigPrettier,
);
