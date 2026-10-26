# @debtflow/contracts

Framework-neutral types, constants and boundary validators shared by frontend zones. This package must not contain UI, network calls, secrets, or mutable state.

## Iframe route synchronization (v1)

The remote advertises `MFE_ROUTE_SYNC_CAPABILITY` in its `debtflow:ready` message's `capabilities` array. A supporting host keeps the iframe document mounted and owns public URL/history entries. `debtflow:navigate` requests an application path; the host maps it through the registry and sends a validated `MfeRouteChangedMessage` containing the private, proxied route. Remote query changes use history replacement; pathname changes use the remote router with replacement. The remote must not create a second browser-history entry.

Validate origin, source window, source name, version and route boundary on both sides. Cross-domain navigation remains host-owned. Hosts retain document navigation for remotes without the capability. Locale messaging is unchanged. Browser integration coverage lives in `tooling/e2e/partner-embedding.mjs`.

## Run check

From the monorepo root:

```bash
npm run typecheck -w @debtflow/contracts
```

Import example:

```ts
import type { ApiEnvelope, CoreIdentity } from '@debtflow/contracts';
```

## Pagination response contracts

`PaginationMeta` describes API metadata: `page`, `pageSize`, `total`, `totalPages`, `hasNextPage`, `hasPreviousPage`. `PaginatedResponse<T>` groups `{ items: T[], meta: PaginationMeta }` for consumers that preserve this metadata. The backend wire envelope is `data: T[]` with `meta.pagination`; transport adapters own that normalization.

The existing flat `PaginatedResult<T>` and `unwrapApiResponse` remain compatible for current consumers. Do not change an existing owner's response shape implicitly.
