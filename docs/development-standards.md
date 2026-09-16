# Development Standards

This document defines the human-facing quality workflow for the DebtFlow Web monorepo. It applies to Shell, Partner Ops, Payments, and shared packages.

## Sources of truth

- Formatting is configured once at the repository root in [prettier.config.mjs](../prettier.config.mjs); ignored paths are listed in [.prettierignore](../.prettierignore).
- Shared ESLint behaviour lives in [tooling/eslint](../tooling/eslint). Each application owns only its framework processor and application boundary rules through its local ESLint config.
- Editor defaults are in [.editorconfig](../.editorconfig).
- Architectural and AI-agent rules are documented from [AGENTS.md](../AGENTS.md). They complement this document; they do not replace framework documentation or code review.

## Local workflow

Run these commands from the repository root.

    npm run format          # Apply Prettier to eligible repository files
    npm run format:check    # Check formatting without writes
    npm run lint            # Lint all applications and packages
    npm run lint:packages   # Lint TypeScript in packages only
    npm run typecheck       # Type-check every workspace
    npm run check           # Boundaries, manifests, lint, typecheck, builds

For a focused change, run the smallest applicable check first:

    npm run lint:shell
    npm run lint:partner-ops
    npm run lint:payments
    npm run check:shell
    npm run check:partner-ops
    npm run check:payments

Use npm run format only when formatting is part of the intended change. Avoid mixing an unrelated repository-wide format pass with product logic in the same pull request.

## ESLint model

The repository uses ESLint flat configuration. Root [eslint.config.mjs](../eslint.config.mjs) validates shared packages. Shared ignores and linter options are defined once in tooling/eslint/shared.mjs.

Each application has a local configuration because its framework needs different rules:

| Area                  | Configuration responsibility                                       |
| --------------------- | ------------------------------------------------------------------ |
| Shell and Partner Ops | Next.js/React rules and Next route-component boundaries            |
| Payments              | Angular TypeScript/template processors and Angular-specific checks |
| Shared packages       | Framework-agnostic TypeScript rules                                |

Do not copy a React or Next rule into Angular, or an Angular rule into a shared package. When adding a cross-repository rule, first decide whether it belongs in the shared ESLint helper, an app config, or an architecture check.

## Imports and module boundaries

- Use an app alias such as @/features/parties for cross-feature source imports inside a Next.js app. Avoid long relative imports such as ../../.. outside a small colocated unit.
- Keep routes in app/ thin. Reusable domain behaviour belongs in features/; presentation-only primitives belong in components/; cross-cutting helpers belong in lib/.
- Do not reach into another feature internals. Publish a deliberately small public surface through that feature only when a stable cross-feature API is needed.
- Never import another micro frontend internal source. Use URL navigation, typed shared packages, or explicit MFE contracts.

## CI enforcement

The Frontend Architecture workflow runs formatting validation, package linting, architecture boundaries, and manifest checks. Per-app workflows run their own framework lint, typecheck, build, and app tests where configured. Their path filters include shared tooling so a Prettier or ESLint change is validated against every affected application.

## Adding or changing tooling

1. Prefer the existing root configuration instead of creating app-local Prettier configuration.
2. Keep framework-specific ESLint setup inside the application that requires it.
3. Update the matching workflow path filters if the configuration can affect CI results.
4. Run format validation, lint, typecheck, and the affected production build before review.
5. Document a material workflow or architectural change in the relevant file under docs/.

## AI instruction layout

DebtFlow deliberately keeps provider-neutral instructions in `AGENTS.md` and `.ai-rules/`. `AGENTS.md` is the short entry point; it links to shared rules, and each deployable app has its own `AGENTS.md` plus local `.ai-rules/` for team-owned detail.

Do not duplicate the same rules in tool-specific folders such as `.claude/` or `.cursor/`. Add an adapter file only when a tool cannot consume `AGENTS.md`, and make it point to the same source of truth rather than copying policy text.
