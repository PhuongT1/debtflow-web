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
      name: 'debtflow/linter-options',
      linterOptions: {
        reportUnusedDisableDirectives: 'error',
        reportUnusedInlineConfigs: 'error',
      },
    },
  ];
}
