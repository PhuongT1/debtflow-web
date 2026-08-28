# Release a Micro Frontend

## Before deployment

1. Run `npm ci` and `npm run check:<app>`.
2. Confirm the app version matches `packages/mfe-registry/src/manifest.json`.
3. Confirm its route prefix is exclusive and `npm run check:architecture` passes.
4. Build the app-owned artifact and record the commit SHA.

## Deploy and cut over

1. Deploy the app without public traffic.
2. Check its direct health path and one deep link.
3. Configure the target environment's `*_ORIGIN`; keep `*_ENABLED=false`.
4. Enable the route and deploy/reload only the gateway or Platform configuration.
5. Smoke-test authentication, direct refresh, API mutation, runtime assets and another zone.
6. Monitor 4xx/5xx, latency and client errors.

## Rollback

Disable the route or restore the previous origin/artifact. Do not recreate the feature inside Platform and do not redeploy unrelated apps. Keep the previous immutable artifact until the observation window closes.
