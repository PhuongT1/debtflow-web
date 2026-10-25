# Integration Entry Points

## Composition and routes

The Shell hosts platform composition; the owning remote keeps its domain code/state. Read the [Shell integration contract](../../apps/shell/.ai-rules/integration.md) and [Partner Ops integration contract](../../apps/partner-ops/.ai-rules/integration.md) for the actual supported entry points and communication rules.

## Authentication and return context

Session and callback changes cross route/app boundaries. Identify the affected login/logout entry point, helper, caller, and destination. Preserve originating path/query context according to the [authentication policy](../../.ai-rules/core/concerns/authentication.md), and verify the actual affected round trip.

## Language and shared presentation

Shared labels/tokens can have both React and Angular consumers. Follow [internationalization policy](../../.ai-rules/core/concerns/i18n.md) and [UI standards](../../.ai-rules/core/frameworks/react/ui-and-accessibility/README.md) where applicable.

## Why this page links to contracts

This is an architecture navigation map. Message schemas, route contracts and auth behavior remain in their owning canonical rules/source; copying them here would create conflicting versions.
