# Deployment guide

## Required topology

Deploy three independent services:

1. `debtflow-api` (NestJS)
2. `@debtflow/shell`
3. `@debtflow/partner-ops`

The public router sends `/parties/**` and `/partner-ops-static/**` to Partner Operations and everything else to Shell. On Vercel, the shell rewrite currently provides this composition. On another provider, reproduce the same route table with its gateway/ingress.

## Build commands

From repository root:

```bash
npm ci
npm run build:shell
npm run build:partner-ops
```

For independent CI jobs use:

```bash
npm run check:shell
npm run check:partner-ops
```

Both Next.js apps use `output: "standalone"`. Each `.next/standalone` artifact contains the runtime files traced for that app and can be packaged/deployed separately; the development root `node_modules` is not copied as the production runtime.

## Release order

1. Deploy Partner Operations without changing production traffic.
2. Verify `/api/health` and direct `/parties` rendering.
3. Deploy Shell with the new `PARTNER_OPS_ORIGIN`.
4. Enable `PARTNER_OPS_ENABLED=true`.
5. Smoke-test login, list, detail, create/update and cross-zone navigation.
6. Roll back by disabling the flag if the zone is unhealthy.

## Production migrations

Frontend deployment must not execute database migrations. Deploy `debtflow-api` migrations as a separate release job before deploying code that requires the new schema.
