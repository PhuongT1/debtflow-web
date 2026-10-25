# Browser Integration Checks

`partner-embedding.mjs` exports `verifyPartnerEmbedding(page, baseUrl)`. Supply an authenticated Playwright `Page` connected to the running Shell/Partner Ops stack; the default Shell URL is `http://localhost:3000`. Seed at least 21 partners so both pagination sizes have another page. No new test framework or browser dependency is bundled here.

```js
import { verifyPartnerEmbedding } from './tooling/e2e/partner-embedding.mjs';

await verifyPartnerEmbedding(page);
```

The check exercises pagination, Back/Forward, list/detail navigation and page-size changes. It verifies one retained iframe runtime, no document reloads, no repeated host loading, no browser/HTTP errors and rejection of spoofed/wrong-version messages. It changes URL state only; no business data is created or deleted. Use a disposable browser session. This is a live integration check, separate from `npm run rules:check`.

For release validation also check direct reload of a detail/query URL, standalone port 3001, locale propagation, leaving/re-entering the domain, and compatibility with a remote that does not advertise `route-sync-v1`. Initial/retry loading and real failure recovery remain valid states; removing their UI is not a substitute for retaining the runtime.
