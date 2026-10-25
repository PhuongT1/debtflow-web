# React Data Fetching

**Activate:** changing requests, query keys, mutations or cache updates. **Scope:** React data ownership; use the project's installed client/query libraries and transport contract.

- Reuse the existing HTTP pipeline for credentials, headers, serialization, cancellation and normalized errors. Query functions return results or throw failures; UI decides presentation and navigation.
- Keep domain query definitions near their feature. Do not introduce a second service/client for an existing endpoint.
- Build stable query keys from normalized server-relevant inputs: identity, filters, pagination and tenant/locale only when they affect the response. Never include tokens, DOM nodes or functions.
- Preserve the installed query provider/cache lifecycle. Do not instantiate a new cache during each render.
- Pass supported abort signals through adapters. An older response must not replace newer request state; intentional cancellation is not a user-facing failure.
- Writes define pending, failure and success explicitly. Prevent duplicate committed actions, preserve retry context after failure, and invalidate/update affected list/detail/summary data only when appropriate.
- Do not close dialogs, navigate or show success before a write succeeds. Optimistic changes require justified reconciliation and rollback semantics.
- Distinguish initial loading, background refresh, empty success, failure and stale data. Do not disguise a failed request as an empty successful list.
- Validate untrusted response boundaries where required; generic TypeScript types do not validate payloads. Map transport data, form values and display models deliberately.

**Accept when:** request serialization matches the actual adapter; different filters have distinct request/key state; cancellation/races are handled; successful writes refresh the affected data and failures remain recoverable. See [React verification](verification.md) for affected scenarios.
