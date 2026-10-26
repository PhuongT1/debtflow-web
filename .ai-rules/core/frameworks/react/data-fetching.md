# React Data Fetching

**Activate:** changing requests, query keys, mutations or cache updates. **Scope:** React data ownership; use the project's installed client/query libraries and transport contract.

- Apply [HTTP/service ownership](../../concerns/http-client.md) for transport changes. Components consume domain services through domain hooks or the configured query layer; do not put a low-level HTTP call inside a component query function.
- Reuse the existing HTTP pipeline for credentials, headers, serialization, cancellation and normalized errors. Query functions return results or throw failures; UI decides presentation and navigation.
- Keep domain query definitions near their feature. Do not introduce a second service/client for an existing endpoint.
- Build stable query keys from normalized server-relevant inputs: identity, filters, pagination and tenant/locale only when they affect the response. Never include tokens, DOM nodes or functions.
- Preserve the installed query provider/cache lifecycle. Do not instantiate a new cache during each render.
- Pass supported abort signals through adapters. An older response must not replace newer request state; intentional cancellation is not a user-facing failure.
- Writes define pending, failure and success explicitly. Prevent duplicate committed actions, preserve retry context after failure, and invalidate/update affected list/detail/summary data only when appropriate.
- Do not close dialogs, navigate or show success before a write succeeds. Optimistic changes require justified reconciliation and rollback semantics.
- Distinguish initial loading, background refresh, empty success, failure and stale data. Do not disguise a failed request as an empty successful list.
- Preserve server pagination metadata in a named group alongside collection items and use its shared type. Components may spread compatible metadata props into a table; do not rebuild server totals or repeat a field mapping across screens. Missing data during loading is distinct from a malformed successful response.
- Validate untrusted response boundaries where required; generic TypeScript types do not validate payloads. Map transport data, form values and display models deliberately.

## TanStack Query when installed

- Confirm the actual query library/version before applying its API. If TanStack Query is present, maintain named query-key factories in a discoverable owner: a small app registry or domain factories with a documented entry. Queries, prefetches and invalidations import the same definitions; no repeated ad hoc arrays or opaque URL strings in components.
- Keys include normalized inputs used by the service. URL parameter order or unrelated client-only parameters must not change cache identity; different server filters must not share a key. Preserve deliberate tenant/user/locale isolation when it changes response data.
- Put query/mutation lifecycle in discoverable domain hooks when the owner follows that convention. Feature hooks belong with the feature; app-wide hooks are reserved for cross-feature capabilities. Hooks own normalized keys, cancellation, mutation dispatch and cache updates; services own HTTP. Reuse query options inside that layer for prefetching where needed. Do not scatter invalidation across screens or make generic UI depend on a domain service. Folder names remain a project choice.
- Organize root/list/detail key prefixes so writes refresh the affected caches. Choose pending/error/success behavior deliberately; do not scatter string prefixes through forms and action buttons.

**Accept when:** request serialization matches the actual adapter; different filters have distinct request/key state; cancellation/races are handled; successful writes refresh the affected data and failures remain recoverable. See [React verification](verification.md) for affected scenarios.

Reference: [TanStack Query keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys). Key factories and folder placement are this library's convention, not a claim that TanStack requires a particular filename.
