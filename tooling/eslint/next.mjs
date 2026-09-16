import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { createSharedLintConfig } from './shared.mjs';

export function createNextLintConfig({ compat }) {
  return [
    ...createSharedLintConfig(),
    ...compat.extends('next/core-web-vitals', 'next/typescript'),
    {
      name: 'debtflow/next-component-boundaries',
      files: ['src/components/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['@/app', '@/app/**'],
                message:
                  'Components must not import from the Next App Router layer. Move reusable code to components, features, or a shared package.',
              },
            ],
          },
        ],
      },
    },
    eslintConfigPrettier,
  ];
}
