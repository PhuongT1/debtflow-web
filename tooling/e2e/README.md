# Browser Integration Checks

`partner-embedding.mjs` exports `verifyPartnerEmbedding(page, baseUrl)`. Supply an authenticated Playwright `Page` connected to the running Shell/Partner Ops stack; the default Shell URL is `http://localhost:3000`. Seed at least 21 partners so both pagination sizes have another page. No new test framework or browser dependency is bundled here.

```js
import { verifyPartnerEmbedding } from './tooling/e2e/partner-embedding.mjs';

await verifyPartnerEmbedding(page);
```

The check exercises pagination, Back/Forward, list/detail navigation and page-size changes. It verifies one retained iframe runtime, no document reloads, no repeated host loading, no browser/HTTP errors and rejection of spoofed/wrong-version messages. It changes URL state only; no business data is created or deleted. Use a disposable browser session. This is a live integration check, separate from `npm run rules:check`.

For release validation also check direct reload of a detail/query URL, standalone port 3001, locale propagation, leaving/re-entering the domain, and compatibility with a remote that does not advertise `route-sync-v1`. Initial/retry loading and real failure recovery remain valid states; removing their UI is not a substitute for retaining the runtime.

## Shared tables

`shared-tables.mjs` exports `verifySharedTables(page, { shellUrl, partnerUrl })`. Use an authenticated Vietnamese session with Shell and standalone Partner Ops running and at least 21 partner/debt-summary records. It checks server-rendered table consumers, debt sorting, standalone/embedded pagination and page-size changes, loading/empty/filter reset, and mobile horizontal scrolling with reachable actions. It temporarily holds a read request to observe skeletons, restores routing/viewport afterward and never submits a business mutation. This live check requires the real stack and seeded data; it is not part of the documentation test suite.

## Parties conventions

`npm run test:party-conventions` runs local source/config checks for the Parties view boundaries, query normalization, API error contract, absence of Vietnamese literals in the feature and catalog key parity. It requires installed development dependencies and makes no network calls. These checks are also included in Frontend Architecture CI; they do not validate real writes or replace the live browser checks.

`party-data-flow.mjs` exports `verifyPartyDataFlow(page)`. In an authenticated Shell/Partner Ops session it tests localized client validation, draft preservation across VI/EN, normalized API field errors, recoverable 503 failure, success invalidation, request headers and single JSON serialization. POST responses are intercepted and fulfilled in the browser; no record is created. It restores Vietnamese and removes interception on exit.

`verifyPartyActions(page)` in the same module covers PATCH error/retry, DELETE cancel/pending/error/retry and successful invalidation. It intercepts detail writes; no record is edited or deleted. Run both functions for data-layer refactors.

The convention suite also checks pagination-envelope preservation/rejection and the injected REST provider’s HTTP methods, encoded IDs, payloads, cancellation signal forwarding and failure propagation.
