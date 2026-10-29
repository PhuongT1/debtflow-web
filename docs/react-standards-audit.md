# React Standards: Source Audit and Follow-up

Reviewed on 2026-10-20 against the working tree, including uncommitted changes. This is a targeted architecture/convention inspection, not a complete correctness or security review. Application code was not refactored as part of this documentation task.

The normative developer/AI standards are selected through the [React rule index](../.ai-rules/core/frameworks/react/README.md). This inventory describes examples and gaps; it must not be used as permission to reproduce an exception.

## What the repository already establishes

| Area                              | Observed source                                                                                                                                                                                | Implication for the standard                                                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| React app aliases                 | [Shell tsconfig](../apps/shell/tsconfig.json), [Partner Ops tsconfig](../apps/partner-ops/tsconfig.json)                                                                                       | `@/` means the current app's `src/`; it cannot cross app boundaries.                                                                |
| Intentional feature APIs          | [Parties entry](../apps/partner-ops/src/features/parties/index.ts), [Dashboard entry](../apps/shell/src/features/dashboard/index.ts)                                                           | Keep external feature consumption explicit; internal siblings import directly.                                                      |
| Domain decomposition              | [Debt feature](../apps/shell/src/features/debts/index.ts), [Partner summary parameter hook](../apps/shell/src/features/debts/partner-summary/use-params.ts)                                    | Small features can stay flat; larger domains can use cohesive list/detail/forms subfolders.                                         |
| Existing request ownership        | [Shell client pipeline](../apps/shell/src/lib/api/client.ts), [Shell debt adapter](../apps/shell/src/services/debt.client.ts), [Partner Ops client](../apps/partner-ops/src/lib/api-client.ts) | Keep app-specific pipelines; do not mandate a new parallel service architecture.                                                    |
| Query and form libraries          | [Parties screen](../apps/partner-ops/src/features/parties/list/party-list.tsx), [Party form](../apps/partner-ops/src/features/parties/form/party-form.tsx)                                     | Build on TanStack Query, React Hook Form, and Zod instead of introducing equivalents.                                               |
| Shared cache lifecycle            | [Query client provider helper](../packages/ui/react/src/providers/query-client.ts)                                                                                                             | Reuse the existing server/browser lifecycle rather than constructing caches during component render.                                |
| Shared UI and neutral integration | [Sign-out dialog](../packages/ui/react/src/components/auth/sign-out-dialog.tsx), [Platform sign-out helper](../packages/platform/sdk/src/auth/sign-out.ts)                                     | Share visual interaction in React UI, cross-framework integration in the SDK, and domain/session policy at the proper app boundary. |
| Shared visual values              | [Design tokens](../packages/ui/tokens/src/index.ts), [MUI theme](../packages/ui/react/src/providers/app-theme.ts)                                                                          | Use shared typography/state styling rather than per-app approximations of common controls.                                          |

These are examples of specific patterns, not endorsements of every implementation detail in each file.

## Gaps to address when those areas are next changed

| Gap                                                     | Evidence                                                                                                                                                                                                                               | Focused follow-up                                                                                                                                                                                             |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login ownership corrected (2026-10-26)                  | [Login form](../apps/shell/src/features/auth/login/login-form.tsx), [brand panel](../apps/shell/src/features/auth/login/login-brand-panel.tsx)                                                                                         | Login now belongs to `features/auth/login/`; the route imports its public feature API. Callback/error behavior is preserved. See the current [component inventory](engineering/component-structure-audit.md). |
| Same-feature internal aliases obscure local ownership   | [Parties screen](../apps/partner-ops/src/features/parties/list/party-list.tsx) imports its form, toolbar, columns, and types through `@/features/parties/...`                                                                          | Prefer direct local imports for touched sibling modules. This is a readability/convention gap, distinct from prohibited cross-app imports.                                                                    |
| Wildcard exports remain in shared UI entries            | [Package entry](../packages/ui/react/src/index.ts), [components entry](../packages/ui/react/src/components/index.ts)                                                                                                                   | Audit consumers before replacing wildcards with supported explicit exports. Do not break imports in a documentation-only cleanup.                                                                             |
| Some text and schema errors are hardcoded               | [Party form](../apps/partner-ops/src/features/parties/form/party-form.tsx), [Parties help content](../apps/partner-ops/src/features/parties/list/party-list.tsx), [Debt schema](../apps/shell/src/features/debts/model/debt.schema.ts) | Move user-facing text into existing locale catalogs; preserve validation semantics and translate existing errors without losing edits.                                                                        |
| Debounced input has a prop/draft synchronization effect | [Debounced search input](../apps/shell/src/components/ui/form/debounced-search-input.tsx)                                                                                                                                              | Verify behavior for URL changes, edits, pending timers, and stable callback dependencies. Assess the synchronization contract before changing it; an effect's presence alone does not establish a bug.        |
| Naming/export styles differ across existing features    | [Debt schema](../apps/shell/src/features/debts/model/debt.schema.ts), [Party types](../apps/partner-ops/src/services/parties/party.types.ts), [Debt entry](../apps/shell/src/features/debts/index.ts)                                  | Keep adjacent role suffixes compatible. Use clear names and named exports for new modules; plan any API migration deliberately.                                                                               |

## What is and is not enforced automatically

| Mechanism                                                        | Current scope                                                                                      | Limit                                                                                                                           |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript app/package checks                                    | Strict typing and configured module resolution                                                     | Cannot prove runtime payload validity, component ownership, or accessible interaction.                                          |
| [Next lint configuration](../tooling/eslint/next.mjs)            | Next core-web-vitals/TypeScript configuration plus a restriction on `components/` importing `app/` | The explicit architectural restriction does not cover all feature-to-feature imports or every React package module.             |
| [Root ESLint configuration](../eslint.config.mjs)                | Shared-package linting, including explicit-`any` restriction                                       | Does not by itself implement all React lifecycle/import/public-API policies in the guide.                                       |
| [Architecture checker](../scripts/check-frontend-boundaries.mjs) | Cross-app/package boundaries, declared dependencies, and neutral-package restrictions              | It is not a complete implementation of same-feature import style, the source-size policy, feature API rules, or UI consistency. |
| Prettier                                                         | Formatting                                                                                         | Does not decide architecture or component responsibilities.                                                                     |
| Browser checks                                                   | Observable interaction, accessibility snapshot, computed styles, console/network evidence          | Only cover the scenarios actually exercised.                                                                                    |

React applications currently expose build, typecheck, and lint scripts; their package scripts do not define a React unit-test command. Do not claim an automated test suite ran when only browser checks or typechecks ran. Establish any new runner as an intentional tooling change.

Possible future enforcement work, after checking existing violations and exception cases:

1. Add an audited restriction for cross-feature private imports and unwanted deep relative paths, with useful error messages and support for configured aliases.
2. Evaluate React Hooks rule coverage for shared React packages, without applying React/Next lint configuration to neutral or Angular packages.
3. Add a source-size check that respects generated/framework configuration files and the documented cohesive-module exception.
4. Define targeted behavior tests where the repository adds a supported React test setup.

These are follow-up candidates, not checks implemented by this documentation update. The React standard remains a required contributor/reviewer checklist for policies not covered by tooling.

## Rule refinement: 2026-10-21

The topic files now include concrete ownership choices, callback/value contracts,
request serialization, query/mutation state transitions, form resets, focus
handoff, and task-specific acceptance scenarios. Their local references identify
the particular pattern to inspect; they do not certify each whole file as ideal.

External guidance was used selectively: React state/hooks, TanStack query
keys/cancellation, MUI wrapper composition, Next server/client boundaries,
React Hook Form reset behavior, and WAI-ARIA dialog interaction. Bulletproof
React informed feature ownership only. Its optional global directories and
current no-barrel recommendation are not adopted wholesale: Debtflow retains
its established service layers and narrow intentional public feature APIs.

Each topic links relevant primary references. This update changes documentation,
not source implementations or lint enforcement. The existing migration gaps and
enforcement limits above remain applicable.
