# Parties Feature

Partner Ops owns the Parties UI in standalone and embedded modes. Routes import the feature public entry; it exports `PartyList`, `PartyListSkeleton` and `PartyDetails`. The runtime directive `use client` does not dictate component naming.

## Source map

```text
apps/partner-ops/src/
  features/parties/
    index.ts
    hooks/
      use-parties.ts           List query, normalized keys and cancellation
      use-party.ts             Detail query and cancellation
      use-save-party.ts        Create/update dispatch and cache invalidation
      use-delete-party.ts      Delete lifecycle and cache invalidation
    model/
      party-filters.ts         Allowed URL filters and query normalization
    list/
      party-list.tsx           List composition
      toolbar.tsx              Filter form and URL navigation
      columns.tsx              Domain cell rendering and actions
      table-columns.ts         Column presentation configuration
      filter.schema.ts         Localized filter validation
      skeleton.tsx             Locale-aware loading composition
    detail/party-details.tsx   Detail composition
    form/
      party-form.tsx           Validation, hook consumption and UI feedback
      to-party-request.ts      Schema values to request-body mapping
      schema.ts                Localized form validation
  lib/api/http-client.ts       App-owned Axios instance and envelope handling
  lib/api/paginated-response.ts Collection-envelope checks, preserves metadata
  lib/api/api-error.ts         Normalized errors and fallback identifiers
  lib/query/query-keys.ts      Named domain key factories
  lib/routing/routes.ts        Reusable URL builders
  lib/domain.ts                Typed wire statuses and domain constants
  hooks/use-active-users.ts    App-wide user options lifecycle
  models/party.ts              Domain Party and PartyDebt models
  models/user.ts               Shared user option model
  services/parties/
    party.service.ts           Composition: configured client + selected provider
    party.types.ts             Capability contract, params/request/response types
    providers/rest.ts          REST implementation with injected transport
  services/user.service.ts     User option service and active-user selection
```

These are actual source owners. The website renders this Markdown directly; use the displayed path to edit it. The [local data contract](../../.ai-rules/project/frameworks/react/data-fetching.md) links the implementation files and owns project-specific choices.

## Data and UI flow

`PartyList` reads URL filters and calls `useParties(filters)`. The hook normalizes server-relevant inputs, import a key from the registry and forward cancellation to the named service. The composed service binds the configured transport to the REST provider implementing `PartyService`. This follows Nimara’s separation of capability contract, implementation and app wiring. A registry/lazy loader becomes useful when there are real alternative providers or costly optional integrations; this single-provider REST service is constructed directly. The provider uses the configured Axios instance; the instance supplies the same-origin proxy, cookies, frontend-zone/current locale headers, timeout and normalized errors. JSON bodies are passed as objects once.

The backend already returns pagination in `meta.pagination`. `apiPaginatedRequest` validates the collection envelope and returns `{ items, meta }`, preserving `totalPages` and next/previous flags as well as page, size and total. `PartyList` passes `rows={items}` and `{...meta}` to the table. The wrapper explicitly consumes the supported fields, so metadata never becomes DOM attributes. The Partner Ops adapter forwards unchanged title/toolbar/skeleton props through `...rest`, defaults `rowKey` to `id` for identified rows and uses the shared default of 8 skeleton rows unless overridden. Other apps retain their existing flat adapters.

Query keys contain no token or unrelated URL state. Domain prefixes are reused by mutation hooks to invalidate list and detail results after success. User statuses use `UserStatus`; labels, schema errors, help, dialogs and feedback use the locale catalogs. Route builders own repeated paths while the app owns router calls and embedded navigation.

## Maintainer checks

Run `npm run lint:partner-ops`, `npm run typecheck:partner-ops`, `npm run test:party-conventions` and `npm run check:architecture` for these boundaries. The convention tests cover forbidden HTTP imports/inline keys, normalized cache identity, error contracts and catalog parity. Lint enforces the configured Parties view boundaries; it does not prove every domain or translated string in the repository is compliant.

Use the live [browser checks](../../tooling/e2e/README.md) for list/detail, filters, pagination, forms and VI/EN state preservation. Browser write/error tests must mock their responses rather than mutate business records just to test plumbing. A passing structural test is not actual API acceptance.

## Portable guidance

[HTTP ownership](../../.ai-rules/core/concerns/http-client.md), [React data fetching](../../.ai-rules/core/frameworks/react/data-fetching.md), [feature boundaries](../../.ai-rules/core/frameworks/react/structure/feature-boundaries.md), [naming](../../.ai-rules/core/frameworks/react/structure/naming.md) and [i18n](../../.ai-rules/core/concerns/i18n.md) are the reusable rules. They activate for the installed libraries and changed responsibilities, independently of AI client discovery. Debtflow's Axios choice and these exact paths remain local.

Local Nimara references: `apps/marketplace/src/services/products.ts` owns product operations using generated GraphQL variables/results; `apps/marketplace/src/hooks/use-debounce.ts` is an app-level hook; `packages/features/src/product-detail-page/shared/hooks/useVariantSelection.tsx` keeps feature-specific state with its feature. `packages/domain/src/objects/Order.ts` reuses attribute fields through `Pick`.

The inspected Nimara code separates service/use-case operations from view composition; the reviewed Stripe client uses Hono RPC and its infrastructure includes GraphQL/provider contracts. Adopt that ownership discipline without claiming it implements this Axios/TanStack setup or copying its package layers into Debtflow.
