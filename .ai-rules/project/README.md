# Debtflow Project Profile

**Read once when establishing project context.** This folder is local to Debtflow and is excluded from the reusable rule-kit export. Do not copy its ports, aliases or SDK names into another project.

## Workspace facts

- npm workspace monorepo; Node.js from root `.nvmrc` (22.23.1) and npm 10+. Preserve the npm lockfile.
- Apps are independently deployed. Never import another app's private source; shared consumers use public workspace packages.
- Preserve existing user changes and public contracts unless the task authorizes changing them.

| Target                                          | Stack / owner instructions                                                                                              |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Platform, dashboard, auth; port 3000            | Next.js App Router + React: [Shell](../../apps/shell/AGENTS.md)                                                         |
| Customers/suppliers; port 3001                  | Next.js App Router + React: [Partner Ops](../../apps/partner-ops/AGENTS.md)                                             |
| Payments; port 3002                             | Angular standalone: [Payments](../../apps/payments/AGENTS.md)                                                           |
| Shared React presentation / neutral integration | Existing `packages/react-ui`, `platform-sdk`, `contracts`, `design-tokens`; inspect public exports and actual consumers |

When proposing, creating or explicitly renaming a Git branch, follow the project [Git Workflow](../../docs/engineering/git-workflow.md). It defines `feature/`, `fixbug/`, `refactor/`, `chore/` and `docs/` prefixes. Do not create or rename a branch merely because a coding task was requested.

When changing lasting code conventions or auditing compliance, follow [Contributing](../../docs/engineering/contributing.md) for canonical ownership, scoped exceptions and review evidence. Do not interpret successful lint as full architectural or behavioral compliance.

## Load local extensions only when touched

| Changed responsibility                                    | Local contract                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Next.js routing, aliases or layering                      | [Next.js](frameworks/nextjs/README.md)                                           |
| Angular aliases, custom element or linked packages        | [Angular](frameworks/angular/README.md)                                          |
| React placement, imports, forms, query, UI or integration | [React local selector](frameworks/react/README.md), then only the matching topic |
| Auth/session/return destination                           | [Authentication](concerns/authentication.md)                                     |
| Locale selection, propagation or translated text          | [I18n](concerns/i18n.md)                                                         |
| Public API/messages                                       | [Contract owner](concerns/api-contracts.md)                                      |
| Formatting/lint/dependencies                              | [Tooling commands](concerns/tooling.md)                                          |

React check commands are in [local verification](frameworks/react/verification.md); other checks come from the target owner's instructions and actual package scripts. Do not load all command/owner pages for a documentation change.

For rule/viewer/tooling changes, `npm run rules:check` runs the existing document/index/export checks and evaluation-utility tests. Maintainers may compare recorded task trials with `npm run rules:evaluate -- --baseline <file> --candidate <file>`; see the optional [evaluation guide](../../docs/ai-guide/evaluation/README.md). These commands do not establish actual AI task acceptance.

Human onboarding: [Getting Started](../../docs/getting-started/README.md). Documentation site: `npm run rules:viewer`. These are local facilities, not dependencies of the portable rules.
