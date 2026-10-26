import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNextLintConfig } from '../../tooling/eslint/next.mjs';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: currentDirectory });

const config = [
  ...createNextLintConfig({ compat }),
  {
    name: 'partner-ops/party-view-boundaries',
    files: ['src/features/parties/{list,detail,form}/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'axios',
                '@tanstack/react-query',
                '@/services/**',
                '@/lib/api/http-client',
                '@/lib/api-client',
              ],
              allowTypeImports: true,
              message:
                'Views consume domain hooks. Services and TanStack Query lifecycle belong outside views.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: "Property[key.name='queryKey'] > ArrayExpression",
          message:
            'Import the domain key factory from lib/query/query-keys; do not repeat query key arrays.',
        },
        {
          selector: "CallExpression[callee.name='fetch']",
          message: 'Call a domain service instead of fetch in a view.',
        },
        {
          selector: 'Literal[value=/^(ACTIVE|INACTIVE)$/]',
          message: 'Use UserStatus from the domain owner.',
        },
      ],
    },
  },
  {
    name: 'partner-ops/service-boundaries',
    files: ['src/services/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react',
                '@tanstack/react-query',
                '@/features/**',
                '@/hooks/**',
                '**/features/**',
              ],
              message:
                'Services own HTTP contracts and must not depend on feature UI or React hooks.',
            },
          ],
        },
      ],
    },
  },
];

export default config;
