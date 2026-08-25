# Debt Flow Shell

The shell is the public entry point and composition gateway. It owns authentication, the same-origin BFF, global routes and the rewrite that mounts Partner Operations at `/parties/**`.

Header/sidebar code is not stored here. React rendering comes from `@debtflow/react-app-shell`; its menu data and tokens come from framework-neutral packages.

## Run from monorepo root (recommended)

```bash
npm install
cp apps/shell/.env.example apps/shell/.env.local
npm run dev:shell
```

Open `http://localhost:3000`.

For `/parties/**` to work, also start Partner Operations:

```bash
npm run dev:partner-ops
```

## Run from this directory

Install dependencies at the monorepo root first, then:

```bash
npm run dev
```

## Build and start

From the monorepo root:

```bash
npm run build:shell
npm run start:shell
```

## Check

```bash
npm run lint -w @debtflow/shell
npm run typecheck -w @debtflow/shell
npm run build:shell
```

## Environment

Copy `.env.example` to `.env.local`. Never commit the resulting file. In production, configure the same keys in the deployment platform instead of creating `.env.production` with real secrets.

- `AUTH_SECRET`: unique production secret.
- `AUTH_URL`: shell public URL.
- `API_BASE_URL`: NestJS URL; server-only.
- `PARTNER_OPS_ENABLED`: enables route delegation.
- `PARTNER_OPS_ORIGIN`: Partner Operations service URL.

The API and auth tokens remain server-side behind `/api/**`.
