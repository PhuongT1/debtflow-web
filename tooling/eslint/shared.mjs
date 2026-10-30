import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { uiConventions } from './ui-conventions.mjs';

export const DEBTFLOW_IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/.angular/**',
  '**/dist/**',
  '**/coverage/**',
  '**/src/generated/**',
  '**/*.generated.{ts,tsx}',
  '**/next-env.d.ts',
];

export function createSharedLintConfig() {
  return [
    {
      name: 'debtflow/global-ignores',
      ignores: DEBTFLOW_IGNORE_PATTERNS,
    },
    {
      name: 'debtflow/source-conventions',
      files: ['**/*.{ts,tsx}'],
      ignores: ['**/*.d.ts', '**/*.config.ts'],
      plugins: { 'simple-import-sort': simpleImportSort },
      rules: {
        'max-lines': ['error', { max: 230, skipBlankLines: false, skipComments: false }],
        'simple-import-sort/imports': [
          'error',
          {
            groups: [
              ['^\\u0000'],
              ['^node:'],
              ['^react(?:$|/)', '^next(?:$|/)', '^@?\\w'],
              ['^@packages/'],
              ['^@/', '^@(core|shared|features)/'],
              ['^\\.\\.'],
              ['^\\.'],
            ],
          },
        ],
      },
    },
    {
      name: 'debtflow/react-theme-ownership',
      files: ['**/*.tsx'],
      plugins: { 'ui-conventions': uiConventions },
      rules: { 'ui-conventions/theme-ownership': 'error' },
    },
    {
      name: 'debtflow/linter-options',
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
        reportUnusedInlineConfigs: 'error',
      },
    },
  ];
}
