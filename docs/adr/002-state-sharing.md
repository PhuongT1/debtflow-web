# ADR 002: Framework-neutral state sharing

Status: accepted

## Decision

Use this order:

1. URL/query parameters for navigation, filters and shareable selection.
2. NestJS HTTP API as the authoritative business state.
3. `/api/mfe/session` and HttpOnly cookies for identity.
4. Versioned browser events from `@debtflow/platform-sdk` only for small invalidation notifications.

Do not share Redux stores, React Query caches, Angular services, access tokens or mutable domain objects between deployable apps. Event payloads contain identifiers and versions; consumers re-fetch authorized data.

## Compatibility

The manifest declares API and event contract majors. A breaking contract requires a new major and a migration window in which producers and consumers can coexist.
