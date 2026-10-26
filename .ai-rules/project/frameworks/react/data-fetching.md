# Debtflow Data Fetching

**Activate:** data fetching, cache keys or mutation changes in Debtflow. Apply the shared [data rules](../../../core/frameworks/react/data-fetching.md) and [HTTP contract](../../../core/concerns/http-client.md) for affected responsibilities.

## Partner Ops browser requests

- Axios is the selected REST transport. Reuse [http-client.ts](../../../../apps/partner-ops/src/lib/api/http-client.ts): same-origin `/api`, cookies, frontend-zone/current locale headers, timeout and abort signals. No extra instances in components or services.
- App-level [Party service](../../../../apps/partner-ops/src/services/parties/party.service.ts) is the composition owner. It binds the configured transport to the [REST provider](../../../../apps/partner-ops/src/services/parties/providers/rest.ts), which implements explicit list/detail/create/update/delete operations against the `PartyService` contract. Hooks import the composed service; they do not select providers. There is currently one REST provider, so no registry or lazy-loader layer is required. [API types](../../../../apps/partner-ops/src/services/parties/party.types.ts) distinguish query/path params, request bodies and responses. Services depend on models/contracts, never feature UI or form schemas. Reuse [domain models](../../../../apps/partner-ops/src/models/party.ts) and public `PaginatedResult`; derive identical fields through utility types, respecting request nullability and PATCH semantics.
- Feature [list hook](../../../../apps/partner-ops/src/features/parties/hooks/use-parties.ts), [detail hook](../../../../apps/partner-ops/src/features/parties/hooks/use-party.ts), [save hook](../../../../apps/partner-ops/src/features/parties/hooks/use-save-party.ts) and [delete hook](../../../../apps/partner-ops/src/features/parties/hooks/use-delete-party.ts) own TanStack lifecycle, signal propagation and successful-write invalidation. Views import hooks, not services or TanStack hooks directly. No feature `api/` folder mixing these owners.
- App-wide [active-user hook](../../../../apps/partner-ops/src/hooks/use-active-users.ts) calls the [User service](../../../../apps/partner-ops/src/services/user.service.ts). Keep Party-only hooks inside the feature.
- List responses preserve `{ items, meta }` through [apiPaginatedRequest](../../../../apps/partner-ops/src/lib/api/http-client.ts) and its [pagination parser](../../../../apps/partner-ops/src/lib/api/paginated-response.ts). The backend already sends `data` plus `meta.pagination`; `meta` retains all six `PaginationMeta` fields. The table consumes compatible fields using `{...meta}`. Leave the legacy `unwrapApiResponse`/`PaginatedResult` contract unchanged for other owners.
- [query-keys.ts](../../../../apps/partner-ops/src/lib/query/query-keys.ts) owns normalized cache identity and domain prefixes. Both list/detail are invalidated after successful writes. Components own translated feedback/dialog state; generic confirmation UI receives the async action and pending/error state, without importing domain services or invalidating caches.
- Schema-inferred form values stay in the form. [Payload mapping](../../../../apps/partner-ops/src/features/parties/form/to-party-request.ts) converts blank optional fields to omitted values explicitly, preserving the current backend contract. Do not spread an entire response into a request.
- [routes.ts](../../../../apps/partner-ops/src/lib/routing/routes.ts) owns reused app URL builders; endpoint paths stay in services. Preserve embedded navigation. Statuses come from [domain.ts](../../../../apps/partner-ops/src/lib/domain.ts); visible strings belong in both catalogs.

```ts
const filters = getPartyListFilters(searchParams);
const partiesQuery = useParties(filters);
```

## Other owners

Shell browser features retain `services/<domain>.client.ts` → `apiClient`; server loaders retain `services/<domain>.server.ts` → `apiServer` with framework/server semantics. This change does not migrate those transports or Angular. Adopt the ownership boundaries when changing an owner deliberately; update its local instructions and preserve session, cache and error contracts.
