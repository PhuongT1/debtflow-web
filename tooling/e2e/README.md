# Browser Integration Checks

`partner-embedding.mjs` exports `verifyPartnerEmbedding(page, baseUrl)`. Supply an authenticated Playwright `Page` connected to the running Shell/Partner Ops stack; the default Shell URL is `http://localhost:3000`. Seed at least 21 partners so both pagination sizes have another page. No new test framework or browser dependency is bundled here.

```js
import { verifyPartnerEmbedding } from './tooling/e2e/partner-embedding.mjs';

await verifyPartnerEmbedding(page);
```

The check exercises pagination, Back/Forward, list/detail navigation and page-size changes. It verifies one retained iframe runtime, no document reloads, no repeated host loading, no browser/HTTP errors and rejection of spoofed/wrong-version messages. It changes URL state only; no business data is created or deleted. Use a disposable browser session. This is a live integration check, separate from `npm run rules:check`.

`verifyInitialEmbeddedLoading(page, baseUrl)` holds the iframe document, checks a page-shaped skeleton with a localized accessible label, verifies that no technical loading message/spinner is shown, then releases the document and verifies handoff to the ready page. Run it before `verifyPartnerEmbedding`; the latter observes the host placeholder itself to ensure it never returns during internal navigation.

For release validation also check direct reload of a detail/query URL, standalone port 3001, locale propagation, leaving/re-entering the domain, and compatibility with a remote that does not advertise `route-sync-v1`. Initial/retry loading and real failure recovery remain valid states; removing their UI is not a substitute for retaining the runtime.

## Shared tables

`shared-tables.mjs` exports `verifySharedTables(page, { shellUrl, partnerUrl })`. Use an authenticated Vietnamese session with Shell and standalone Partner Ops running and at least 21 partner/debt-summary records. It checks server-rendered table consumers, debt sorting, standalone/embedded pagination and page-size changes, loading/empty/filter reset, and mobile horizontal scrolling with reachable actions. It temporarily holds a read request to observe skeletons, restores routing/viewport afterward and never submits a business mutation. This live check requires the real stack and seeded data; it is not part of the documentation test suite.

## Parties conventions

`npm run test:party-conventions` runs local source/config checks for the Parties view boundaries, query normalization, API error contract, absence of Vietnamese literals in the feature and catalog key parity. It requires installed development dependencies and makes no network calls. These checks are also included in Frontend Architecture CI; they do not validate real writes or replace the live browser checks.

`party-data-flow.mjs` exports `verifyPartyDataFlow(page)`. In an authenticated Shell/Partner Ops session it tests localized client validation, draft preservation across VI/EN, normalized API field errors, recoverable 503 failure, success invalidation, request headers and single JSON serialization. POST responses are intercepted and fulfilled in the browser; no record is created. It restores Vietnamese and removes interception on exit.

`verifyPartyActions(page)` in the same module covers PATCH error/retry, DELETE cancel/pending/error/retry and successful invalidation. It intercepts detail writes; no record is edited or deleted. Run both functions for data-layer refactors.

The convention suite also checks pagination-envelope preservation/rejection and the injected REST provider’s HTTP methods, encoded IDs, payloads, cancellation signal forwarding and failure propagation.

## Skeleton-to-page comparison

`party-skeleton-layout.mjs` exports `verifyPartySkeletonLayout(page, { width, height, screenshotPrefix })`. It holds the embedded document, captures the host skeleton, releases it, and compares header/filter/table-row/column/footer geometry against the real page with a 1px tolerance. It uses real reads only and may save `-skeleton.png` / `-loaded.png` pairs outside the repository. Use the same locale/sidebar state, and include widths where the remote viewport crosses a breakpoint (for example outer widths 1600, 1366, 1024 and 390). Inspect the screenshots as well as the assertions.

## Empty-state centering

`table-empty-state.mjs` exports `verifyTableEmptyState(page)`. It checks embedded/standalone Parties on desktop/mobile plus the Shell debt-summary table (fixed table layout) and server-rendered overdue table, at left/middle/right horizontal scroll positions. The empty message must remain centered in the visible body within 1px. It also verifies the decorative icon, no whole-page horizontal overflow and fixed columns after data returns. All scenarios use real filtered reads, without business mutations.

## Documentation presentation

`documentation-presentation.mjs` exports `verifyDocumentationPresentation(page, { baseUrl })`. Start `npm run docs:dev`, then supply a Playwright Page; no application login or backend is needed. Repeat against `http://127.0.0.1:4318` after `npm run docs:build` and `npm run docs:preview` to check the static artifact. The check covers the setup sequence, always-underlined article links, step anchors, command/flag coloring, exact copied code, inert HTML-like code content and mobile page overflow. It writes desktop/mobile screenshots under `/tmp`. Clipboard writes are intercepted in the page, so the system clipboard is preserved. The check leaves the page at mobile width; use a separate test tab.

## Platform overlays

`npm run test:overlays` runs the transport/contract tests without a browser. `platform-overlays.mjs` exports `verifyPlatformOverlays(page, { baseUrl, embedded, width })` , `verifyOverlayPendingMutations(page)`; `overlay-boundary.mjs` exports `verifyOverlayHostBoundary(page)`. Use an authenticated English browser session and the running Shell/Partner Ops stack. Run embedded widths 1440 and 390, then standalone with `baseUrl: 'http://localhost:3001', embedded: false`. Every tested POST/PATCH/DELETE is intercepted and fulfilled; no business mutation reaches the backend. The checks cover full-viewport geometry, dropdowns, dirty confirmation, API error/retry, cache refresh, focus restoration, help Escape and cancellation. The second function holds mocked edit/delete requests and checks Escape/backdrop guards before fulfilling success. Screenshots are saved under `/tmp`. Run in a disposable test tab; these functions navigate and resize it.

`overlay-layout.mjs` exports `verifyOverlayLayout(page, width)`. It samples opening/closing animation frames at desktop/mobile widths, rejects temporary-height panels and empty content during exit, and performs no mutations.

For Shell list placeholders, run `verifyShellTableSkeletons(page)` from `shell-table-skeletons.mjs` with an authenticated Playwright page. It compares streamed loading markup against loaded Debts, Overdue, Aging and Users screens; optional `screenshotPrefix` saves both states. `verifyPaymentTableSkeleton(page)` holds the Payments API to compare Angular loading rows with the same loaded table. These helpers perform read-only navigation and requests.
