# Debt Flow Web — Agent Instructions

This is the entry point for the repository. Detailed, shared policies are maintained in [`.ai-rules/`](.ai-rules/README.md).

## Read before changing code

| Scope                                         | Read                                                                                                                                                                    |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Every change                                  | [Rule map](.ai-rules/README.md), [common rules](.ai-rules/common.md), [code structure and TypeScript](.ai-rules/code-style.md), [MFE rules](.ai-rules/microfrontend.md) |
| React code                                    | [React rules](.ai-rules/frameworks/react.md)                                                                                                                            |
| Next.js code                                  | [Next.js rules](.ai-rules/frameworks/nextjs.md)                                                                                                                         |
| Angular code                                  | [Angular rules](.ai-rules/frameworks/angular.md)                                                                                                                        |
| Authentication/session                        | [Authentication rules](.ai-rules/concerns/authentication.md), [security rules](.ai-rules/security.md)                                                                   |
| Locale, text, date/number formatting          | [i18n rules](.ai-rules/concerns/i18n.md)                                                                                                                                |
| API contracts or cross-window messages        | [API contract rules](.ai-rules/concerns/api-contracts.md)                                                                                                               |
| Linting, formatting, or tooling configuration | [tooling rules](.ai-rules/concerns/tooling.md)                                                                                                                          |

Then read the nearest application/package `AGENTS.md`; it links to rules owned by that team. More deeply nested instructions add scope-specific requirements.

## Repository facts

- This is an npm workspace monorepo. Use `npm`, not Yarn or pnpm.
- Node.js 20+ and npm 10+ are required.
- Apps are independently deployable. Never import internal source code from one deployable app into another.
- Before finishing, run the smallest relevant validation command documented in the applicable rules.
