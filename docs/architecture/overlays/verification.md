# Verification

## Automated checks

```bash
npm run test:overlays
npm run test:party-conventions
npm run check:architecture
npm run rules:check
npm run docs:build
```

The overlay contract/SDK tests run without React: message validation, wrong peer/origin/ID rejection, acceptance/timeout, disposal, host/content lifecycle and result data. UI acceptance additionally requires a browser.

## Browser scenarios

Use an authenticated English browser session with Shell and Partner Ops running. Functions in `tooling/e2e/platform-overlays.mjs` intercept the tested writes; no domain mutation reaches the backend.

```ts
await verifyPlatformOverlays(page, { width: 1440 });
await verifyPlatformOverlays(page, { width: 390 });
await verifyPlatformOverlays(page, {
  baseUrl: 'http://localhost:3001',
  embedded: false,
  width: 1440,
});
await verifyOverlayPendingMutations(page);
// From tooling/e2e/overlay-boundary.mjs:
await verifyOverlayHostBoundary(page);
```

Check opening, API failure/retry, draft/discard guards, pending save/delete, dropdowns, Escape, backdrop, caller focus, cache refresh, unknown views and disposal. Also check a fresh content load and repeated opens at desktop/mobile widths.

## Opening and closing without layout flashes

Compare the same view in standalone and embedded mode at equal modal widths. Record the transition, not only a final screenshot.

- Keep the host dialog hidden while the content route loads and receives `init`.
- Content waits for its initial render/fonts, measures natural height, then emits `presented`.
- Open at that measured height. `ready` is listener readiness and must not reveal an empty temporary 240px panel.
- Keep the content iframe mounted through the entire exit animation. Report completion and restore caller focus only after exit.
- Later validation/error text may legitimately resize the content; distinguish that from an initial placeholder jump.
- Form columns use content width. Do not let a wider Shell window change a narrow embedded form's layout.

`tooling/e2e/overlay-layout.mjs` samples visible modal dimensions/content across animation frames to catch temporary-size panels and content removal before exit. The browser checks complement screenshots; a correct final frame alone is insufficient.

## What is and is not covered

The runtime adapter in this repository is React/MUI and is exercised through the current same-origin proxy. The transport tests also exercise distinct owner/content origin values without React. An Angular UI adapter and a different cross-domain authentication/CSP deployment require their own integration/browser verification; do not report them as implemented merely because the SDK is portable.

`verifyDeferredOverlayLayout(page)` in the same layout module holds initial user/options data and verifies that the modal stays hidden until that data is available.

## Retained runtime and repeated opens

Run `verifyOverlayPerformance(page)` from `tooling/e2e/overlay-performance.mjs`. It checks four edit rows, create-form reset, document reuse, repeated-open latency and console errors. Run it again with `{ baseUrl: 'http://localhost:3001', embedded: false }` for standalone behavior. Warm timing is environment-dependent; cold route/data loading may still delay the first presentation.

`verifyPartnerRetry({ page })` in `tooling/e2e/partner-embedding.mjs` checks that retry creates a new remote window and rebinds its overlay bridge.
