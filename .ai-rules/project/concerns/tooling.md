# Debtflow Tooling

**Activate:** tooling changes in Debtflow; load only this selected local extension.

## Node runtime

- Root `.nvmrc` pins the shared development/CI runtime. Every workflow uses `actions/setup-node` with `node-version-file: .nvmrc`; include `.nvmrc` in workflow path filters.
- Root `package.json` and root lockfile engines must match the installed framework requirements. For the current Angular CLI 22, Node 20 is unsupported. Do not downgrade dependencies to hide a CI runtime mismatch.
- When changing the runtime/dependency baseline, update `.nvmrc`, compatible engine ranges and onboarding docs together; retain one source of the CI version.

## Formatting

- Prettier is configured once at repository root in `prettier.config.mjs`. Do not add an app-local Prettier config unless a documented framework limitation requires it.
- Use `npm run format` to apply formatting and `npm run format:check` in CI or before review.

## Linting

- ESLint uses flat config. Shared policy belongs in `tooling/eslint/`; framework processors and app architecture rules stay in each app's `eslint.config.*`.
- Do not use ESLint as a formatter. `eslint-config-prettier` is the final config entry to disable rule conflicts.
- Run the smallest relevant lint command after changes: `lint:shell`, `lint:partner-ops`, `lint:payments`, or `lint:packages`.

Reusable policy: [tooling](../../core/concerns/tooling.md).
