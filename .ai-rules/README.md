# Debt Flow AI Rules

This directory is the canonical, tool-neutral source of engineering guidance for the Debt Flow Web monorepo. It is intentionally separate from product documentation and source code.

## Rule selection

Always read `common.md`, `code-style.md`, and `microfrontend.md`. Then select exactly the rules that match the changed area:

| Changed area                 | Required additional rules                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------- |
| `apps/shell/**`              | `frameworks/nextjs.md`, `frameworks/react.md`, `apps/shell/AGENTS.md`                                |
| `apps/partner-ops/**`        | `frameworks/nextjs.md`, `frameworks/react.md`, `apps/partner-ops/AGENTS.md`                          |
| `apps/payments/**`           | `frameworks/angular.md`, `apps/payments/AGENTS.md`                                                   |
| `packages/**`                | `packages/AGENTS.md`; additionally `concerns/api-contracts.md` for contracts or integration messages |
| Authentication/session code  | `concerns/authentication.md`                                                                         |
| Locale/message/UI formatting | `concerns/i18n.md`                                                                                   |

Read a cross-cutting rule only when the task touches that concern. Do not load every rule by default.

## Maintenance rules

- Keep rules concise, factual, and testable; record architectural decisions in `docs/`, not here.
- Keep each rule in its owning canonical file: root `.ai-rules/` for shared policy or the owning app/package `.ai-rules/` directory for local policy. Do not copy content into tool-specific instruction files.
- Put app-owned rules in `apps/<app>/.ai-rules/` and list them from that app's `AGENTS.md`; keep this root directory shared-only.
- Add a root concern rule only for a policy used by more than one application.
