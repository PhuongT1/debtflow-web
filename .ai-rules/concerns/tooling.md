# Tooling Rules

## Formatting

- Prettier is configured once at repository root in `prettier.config.mjs`. Do not add an app-local Prettier config unless a documented framework limitation requires it.
- Use `npm run format` to apply formatting and `npm run format:check` in CI or before review.
- Formatting is a dedicated change. Do not mix a repository-wide format pass with feature logic changes.

## Linting

- ESLint uses flat config. Shared policy belongs in `tooling/eslint/`; framework processors and app architecture rules stay in each app's `eslint.config.*`.
- Do not use ESLint as a formatter. `eslint-config-prettier` is the final config entry to disable rule conflicts.
- Add a dependency directly to the workspace that imports it. Do not rely on npm hoisting.
- Run the smallest relevant lint command after changes: `lint:shell`, `lint:partner-ops`, `lint:payments`, or `lint:packages`.

## Boundaries

- Add `no-restricted-imports` only after auditing current imports and with a message that explains the supported destination.
- Do not apply Next/React lint rules to Angular or shared packages.
