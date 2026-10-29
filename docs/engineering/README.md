# Engineering

This tab answers **how code should be written and maintained**: conventions, framework principles, boundaries and documentation ownership. It is a reference for developers and AI, not the AI setup entry.

## Start here: writing a component

New to the team or reviewing component work? Open [Component Development](component-development.md) for one checklist covering structure, naming, services, conditional Axios/TanStack rules, query keys, constants/routes, i18n and verification. Each item links to its canonical rule; use the detailed reference below only for the responsibility you are changing.

See [Module Imports](module-imports.md) for concise package imports, module indexes, exported props and Angular public APIs.

## Engineering or AI Guide?

| You need to...                                                                | Start here                                                             |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Check naming, component design, React/Next.js/Angular or security conventions | Engineering: select the responsibility below                           |
| Set up Codex, Claude Code or Cursor; find what each tool reads                | [AI Guide → Client Setup](../ai-guide/project-context/client-setup.md) |
| Write a useful task prompt or review AI's result                              | [AI Guide](../ai-guide/README.md)                                      |
| Find the app/package owning the change                                        | [Architecture](../architecture/README.md)                              |
| Maintain shared rules or move the toolkit to another project                  | [Rule Reuse](rule-reuse/README.md)                                     |

Follow [Contributing](contributing.md) for consistent code decisions, review evidence and rule exceptions. [Git Workflow](git-workflow.md) defines branch names.

The [Component Structure Audit](component-structure-audit.md) lists every audited TSX module in shared packages, Partner Ops and Shell, with source links and grouping conventions.

## Find the relevant coding standard

| Responsibility                                    | Canonical rules                                                                                                                                                 |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Common conventions and naming/types               | [Common](../../.ai-rules/core/standards/common.md), [code style](../../.ai-rules/core/standards/code-style.md)                                                  |
| React                                             | [Topic selector](../../.ai-rules/core/frameworks/react/README.md), then only relevant modules                                                                   |
| Next.js placement/routes/server-client boundaries | [Next.js guide](frameworks/nextjs/code-placement.md)                                                                                                            |
| Angular                                           | [Angular rules](../../.ai-rules/core/frameworks/angular/README.md)                                                                                              |
| Shared packages and public contracts              | [Shared consumers](../../.ai-rules/core/execution/shared-code.md); inspect the actual exports and consumers                                                     |
| Independently deployed host/embedded integration  | [MFE boundaries](../../.ai-rules/core/standards/microfrontend.md), only when those modes exist                                                                  |
| Auth/security                                     | [Authentication](../../.ai-rules/core/concerns/authentication.md), [security](../../.ai-rules/core/standards/security.md)                                       |
| Locale, API contracts, tooling                    | [i18n](../../.ai-rules/core/concerns/i18n.md), [contracts](../../.ai-rules/core/concerns/api-contracts.md), [tooling](../../.ai-rules/core/concerns/tooling.md) |

Do not read every linked document for a local change. A styling change, a hook refactor and an API change activate different modules. Canonical rules live in `.ai-rules/`; this page is a discovery map.

For adding pages, source folders, callouts and navigation, follow [Documentation structure and authoring](documentation/README.md).

To use the rules in another React, Next.js or Angular repository, follow [Rule Reuse](rule-reuse/README.md). Replace the project profile, not the shared workflows.
