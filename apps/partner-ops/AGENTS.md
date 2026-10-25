# Partner Ops Agent Instructions

Partner Ops is an independently deployable domain MFE. Start with the [repository instructions](../../AGENTS.md), then read local rules owned by the Partner Ops team.

## Local rules

- [Partner Ops architecture](.ai-rules/architecture.md)
- [Internationalization](.ai-rules/i18n.md) — required for user-visible text, locale, or formatting work.
- [Platform integration](.ai-rules/integration.md) — required for Shell embedding, navigation, or cross-window messages.

## Shared rules often needed here

- [Next.js](../../.ai-rules/core/frameworks/nextjs/README.md) and [React rule index](../../.ai-rules/core/frameworks/react/README.md), then only its task-matched modules
- [Micro frontend boundaries](../../.ai-rules/core/standards/microfrontend.md)
- [Authentication](../../.ai-rules/core/concerns/authentication.md) or [contracts](../../.ai-rules/core/concerns/api-contracts.md) when relevant.
