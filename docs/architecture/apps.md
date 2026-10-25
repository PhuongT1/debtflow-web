# Application Ownership

## Shell

`apps/shell` is the Next.js platform host. App Router adapters are under `src/app`; domain work belongs to its owning feature. Host composition and remote integration are separate from business pages.

Read [Shell architecture](../../apps/shell/.ai-rules/architecture.md) and [integration rules](../../apps/shell/.ai-rules/integration.md) when those responsibilities change.

## Partner Ops

`apps/partner-ops` owns parties/customer/supplier workflows. Routes under `src/app/(workspace)/parties` consume the feature-facing surface. Party forms, queries, tables and state belong in `src/features/parties`; embedding bridges belong in `components/platform`.

Read [Partner Ops architecture](../../apps/partner-ops/.ai-rules/architecture.md) and [integration rules](../../apps/partner-ops/.ai-rules/integration.md).

## Payments

`apps/payments` is the Angular payments application. Its `package.json` defines its independent development/build commands. Follow [Payments owner instructions](../../apps/payments/AGENTS.md) and the [Angular standard](../../.ai-rules/core/frameworks/angular/README.md).

## Before a cross-app edit

Map actual consumers and public contracts first. Source location alone does not establish safe scope. Apply [MFE boundaries](../../.ai-rules/core/standards/microfrontend.md) and [shared-code impact rules](../../.ai-rules/core/execution/shared-code.md).
