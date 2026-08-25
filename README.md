# Debt Flow Web

Production-oriented, route-based micro frontend platform for Debt Flow. The repository uses npm workspaces so independently deployable frontend zones can share stable, framework-neutral contracts while keeping application code, environment, aliases, dependencies, builds and releases isolated.

## Architecture

```text
Browser
  |
  v
Shell / edge gateway (:3000)
  |-- /, /debts, /overdue, /payments, /imports, /users --> apps/shell
  `-- /parties/** --------------------------------------> apps/partner-ops (:3001)

Each frontend --> packages/contracts (API and identity types)
              --> packages/navigation (route/menu metadata)
              --> packages/design-tokens (CSS + TypeScript tokens)
              --> packages/platform-sdk (versioned browser events)

React/Next zones --> packages/react-app-shell (React shell adapter)
                 --> packages/react-ui (React/MUI adapter)

All frontends --> debtflow-api (:4000, source of truth)
```

This is a route-composed micro frontend because each zone has an explicit business boundary, its own runtime/build/deployment, isolated feature code and route ownership. The integration boundary is HTTP, URL and framework-neutral contracts, so a future zone may use Angular, React, Vue or another web framework. One frontend never imports feature code from another frontend.

The current two zones happen to use Next.js. Their React-only code is deliberately named `react-*`; a non-React zone must not depend on those packages.

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- `debtflow-api` running at `http://localhost:4000`

## First-time setup

Run from this directory:

```bash
npm install
cp apps/shell/.env.example apps/shell/.env.local
cp apps/partner-ops/.env.example apps/partner-ops/.env.local
```

Generate a local Auth.js secret and put it in `apps/shell/.env.local`:

```bash
openssl rand -base64 32
```

## Run all frontend zones

1. Start `debtflow-api` on port `4000`.
2. In this repository run:

```bash
npm run dev
```

3. Open `http://localhost:3000`.
4. Login through the shell.
5. Open `http://localhost:3000/parties`. The URL stays on port `3000`, while the shell proxies that route and its assets to `partner-ops` on port `3001`.

Direct zone URLs are also useful for isolation checks:

- Shell: `http://localhost:3000`
- Partner Operations health: `http://localhost:3001/api/health`
- Partner Operations UI: `http://localhost:3001/parties`

## Run one app

Shell only:

```bash
npm run dev:shell
```

Partner Operations only (the shell must still be available for session/API proxying):

```bash
npm run dev:partner-ops
```

## Install a dependency for only one app

Do not add app dependencies to the root `package.json`.

```bash
# Used only by Shell
npm install <package-name> -w @debtflow/shell

# Used only by Partner Operations
npm install <package-name> -w @debtflow/partner-ops
```

The dependency is declared only in that app's `package.json`. npm may physically hoist a compatible copy into the root `node_modules` to save disk space, but the other app does not own or import it. If versions conflict, npm installs the additional version within the required dependency tree.

Repository npm policy is explicit in `.npmrc`:

- `install-strategy=hoisted` optimizes development disk/install time while package ownership remains manifest-based.
- `strict-peer-deps=true` fails installation on incompatible peer dependency graphs instead of silently accepting an unsafe React/framework combination.
- `package-lock.json` pins the complete dependency tree, and CI/production must use `npm ci`.

Two apps may use different versions of an ordinary dependency. npm resolves each import from the requesting app's dependency tree. Framework singleton/peer packages such as React and React DOM require a compatible adapter version; an Angular app does not consume the React adapters at all.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run check:boundaries
npm run build
```

The root `build` command discovers every workspace that declares a `build` script. A future Angular, Vue or React app is included automatically; its framework-specific command remains inside its own `package.json`.

Run everything before a pull request:

```bash
npm run check
```

`check` first removes generated `.next` and TypeScript build-info files, preventing stale route types after a route moves between zones.

`check:boundaries` prevents cross-app imports, TypeScript aliases that escape an app, undeclared hoisted dependencies, deployable-app dependencies and framework imports inside neutral packages.

Run the pipeline for only one deployable app:

```bash
npm run check:shell
npm run check:partner-ops
```

Both independent pipelines also enforce workspace dependency and TypeScript import boundaries before building.

Each Next.js build produces its own standalone server trace. Production does not run from the development root `node_modules` directory.

## Environment strategy

Environment files are app-owned and never shared as secrets through a package:

- Local: `.env.local`, created from `.env.example` and ignored by Git.
- Production: configure environment variables in the selected deployment platform.
- Never commit `.env`, `.env.local`, passwords, tokens or Auth.js secrets.
- `NEXT_PUBLIC_*` is browser-visible. Backend URLs and secrets must remain server-only.

Important shell variables:

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Signs the Auth.js session |
| `AUTH_URL` | Public shell origin |
| `API_BASE_URL` | NestJS API base URL, server-only |
| `PARTNER_OPS_ENABLED` | Enables `/parties/**` zone routing |
| `PARTNER_OPS_ORIGIN` | Internal/public origin of Partner Operations |

Important Partner Operations variables:

| Variable | Purpose |
| --- | --- |
| `CORE_APP_ORIGIN` | Server-side shell origin for session/API calls |
| `PUBLIC_APP_ORIGIN` | Browser-visible shell origin used for redirects |
| `PARTNER_OPS_ASSET_PREFIX` | Unique static asset namespace |

## Independent deployment

Each app can be built independently:

```bash
npm run build:shell
npm run build:partner-ops
```

Deploy two services and route them behind one domain:

- shell: default service for all routes;
- partner-ops: `/parties/**` and `/partner-ops-static/**`;
- API: separate `debtflow-api` service or domain.

Vercel can currently provide these two frontend deployments. The route contract is provider-neutral, so the same artifacts can later run behind Nginx, Kubernetes Ingress, Cloudflare, AWS or another reverse proxy. See [docs/architecture.md](docs/architecture.md) and [docs/deployment.md](docs/deployment.md).

## Ownership rules

- Modify menu labels/routes/ownership only in `packages/navigation`.
- Modify cross-framework colors, spacing and dimensions only in `packages/design-tokens`.
- Modify the React header/sidebar rendering only in `packages/react-app-shell`.
- Modify Party UI/business behavior only in `apps/partner-ops`.
- Modify core finance domains only in `apps/shell`.
- Put wire-format types in `packages/contracts`; do not place business services there.
- Share server state through `debtflow-api`, navigation state through the URL and only small notifications through `platform-sdk`.
- Never share a global Redux/React Query cache across zones.

For a future Angular zone, follow [docs/adding-a-frontend-zone.md](docs/adding-a-frontend-zone.md). It consumes the neutral packages and owns its own dependencies, build and deployment; it does not import React or Next.js.
