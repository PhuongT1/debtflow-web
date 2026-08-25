# Debt Flow Partner Operations

Independent Next.js micro frontend responsible for customer and supplier workflows:

- `/parties`
- `/parties/:id`
- create, read, update and deactivate Party operations

It owns UI and feature logic, not a separate copy of the global layout. React layout comes from `@debtflow/react-app-shell`; route ownership and visual tokens are framework-neutral.

## Run from monorepo root (recommended)

```bash
npm install
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
npm run dev:partner-ops
```

The app starts on `http://localhost:3001`. Shell must run on port `3000` for session and `/api/**` proxying:

```bash
npm run dev:shell
```

Use the canonical composed URL `http://localhost:3000/parties`. Use `http://localhost:3001/parties` only to test the zone independently.

## Run all zones

```bash
npm run dev
```

## Build and start

```bash
npm run build:partner-ops
npm run start:partner-ops
```

## Check

```bash
npm run lint -w @debtflow/partner-ops
npm run typecheck -w @debtflow/partner-ops
npm run build:partner-ops
```

## Environment

- `CORE_APP_ORIGIN`: shell origin used by server-side session/API requests.
- `PUBLIC_APP_ORIGIN`: shell URL used for login redirects.
- `PARTNER_OPS_ASSET_PREFIX`: unique asset namespace; default `/partner-ops-static`.

This app does not own refresh/access tokens. During SSR it forwards the incoming session cookie to the shell's `/api/mfe/session`, which returns only minimal identity and role data.

Business state is shared through `debtflow-api`, not React context or a cross-app cache. Cross-zone navigation intentionally performs a full document navigation; same-zone navigation stays client-side.
