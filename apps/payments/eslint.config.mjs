import { createRequire } from 'node:module';
import { defineConfig } from 'eslint/config';
import { createSharedLintConfig } from '../../tooling/eslint/shared.mjs';

const require = createRequire(import.meta.url);
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const eslintConfigPrettier = require('eslint-config-prettier/flat');

export default defineConfig([
  ...createSharedLintConfig(),
  {
    name: 'debtflow/payments/typescript',
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'df',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'df',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    name: 'debtflow/payments/templates',
    files: ['src/**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
  },
  eslintConfigPrettier,
]);
