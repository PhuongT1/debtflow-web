# Micro frontend architecture

## Route ownership

| Zone | Routes | Responsibility |
| --- | --- | --- |
| shell | `/`, `/debts/**`, `/overdue/**`, `/reports/**`, `/payments/**`, `/imports/**`, `/users/**`, `/login` | Composition gateway, authentication and core finance operations |
| partner-ops | `/parties/**` | Customer/supplier lifecycle, search, detail and mutations |

Routes are exclusive. Two zones must never implement the same production route. Party pages exist only in Partner Operations; Shell keeps only a small Party lookup adapter required by Debt forms.

## Composition model

The browser enters through the shell domain. Next.js rewrites `/parties/**` and `/partner-ops-static/**` to Partner Operations. Navigation inside one zone is a client-side Next transition; navigation to another zone intentionally performs a document navigation. This protects runtime isolation and prevents two React/Next runtimes from being combined in one page.

`@debtflow/react-app-shell` is compiled into React/Next deployments. It is an adapter, not a runtime host. Framework-neutral `@debtflow/navigation` and `@debtflow/design-tokens` can also be consumed by Angular or another browser framework.

## Data sharing

Use these mechanisms in priority order:

1. URL path/query for shareable filters, sort, pagination and selected identifiers.
2. `debtflow-api` for business state and authorization.
3. Auth/session endpoint for minimal identity (`id`, `name`, `email`, `role`).
4. Versioned platform events for same-document notifications only.

Never pass complete Party/Debt objects through browser events. Emit an ID and let the consumer revalidate its API query.

## Dependency rule

```text
                         +--> contracts
Any frontend framework --+--> navigation
                         +--> design-tokens
                         `--> platform-sdk

React/Next frontends ----+--> react-app-shell
                         `--> react-ui

Angular frontend --------X--> react-app-shell / react-ui / Next.js

apps/* --------X--------> apps/*
packages/* -----X-------> apps/*
```

`contracts`, `navigation`, `design-tokens` and `platform-sdk` must remain free of React, Next.js, Angular, MUI and application feature code. Framework adapters may depend on neutral packages, never the reverse.

These rules are executable architecture. `npm run check:boundaries` scans workspace manifests, TypeScript aliases and source imports. It fails when an app imports another deployable app, when a relative import escapes its workspace, or when source code relies on a hoisted package that its own manifest does not declare.

## Polyglot zones

Micro frontend does not mean that a React component can be imported directly by Angular. Framework independence is achieved at the composition boundary:

- the gateway delegates an exclusive URL prefix to a deployable frontend;
- every frontend can start, build, test and deploy by itself;
- the browser and API exchange normal HTTP, JSON, URL and versioned event contracts;
- visual consistency comes from CSS design tokens and navigation metadata;
- framework-specific components stay inside an adapter or application.

An Angular zone therefore owns its own `package.json`, Angular runtime and pipeline. It may consume `@debtflow/contracts`, `@debtflow/navigation`, `@debtflow/design-tokens/tokens.css` and `@debtflow/platform-sdk`; it must not consume either React package. See [adding-a-frontend-zone.md](adding-a-frontend-zone.md).

## Shared shell policy

The shell is the composition/gateway authority. The current route-based model lets every zone run directly for development and disaster diagnosis, so React zones render the same chrome through `@debtflow/react-app-shell`. Navigation and visual primitives still have only one source of truth in neutral packages.

If a future requirement demands changing the rendered sidebar once without rebuilding any consuming zone, publish the chrome as an independently versioned Web Component/CDN artifact or move to runtime composition. That is a separate operational trade-off; it should not be introduced merely to add Angular because it increases runtime coupling and failure modes.

## Performance rules

- Prefer React Server Components; add `"use client"` only at interaction boundaries.
- Paginate/filter on the API; never download entire business tables.
- Keep a unique asset prefix per zone.
- Avoid duplicated framework dependencies through npm workspace hoisting.
- Lazy-load heavy dialogs/charts and measure route bundles in CI.
- Cache public/reference data explicitly; authenticated financial data defaults to no-store unless a domain policy says otherwise.

## Dependency and version isolation

Every app owns its runtime dependencies in its own `package.json`. The root manifest contains development orchestration tools only. npm may hoist compatible packages as a physical install optimization; source ownership is still enforced by `check:boundaries`, and conflicting normal package versions are installed in the appropriate nested dependency tree.

Peer dependencies are different: React renderers, React DOM and framework adapters must be compatible inside one application. `.npmrc` enables `strict-peer-deps`, so an invalid combination fails during `npm ci`. An Angular zone owns Angular dependencies and must not load React adapters.

The root lockfile makes clean installs deterministic. Production isolation comes from one standalone artifact per app, not from the physical development location of `node_modules`.

Internal workspace packages have one source version per monorepo commit. If teams later need two released versions of the same internal package simultaneously, publish versioned artifacts to a registry and consume explicit versions; do not copy source between apps.

## Failure isolation

The shell exposes `PARTNER_OPS_ENABLED` as a release switch. Production traffic switches only after the partner health endpoint and smoke tests pass. Rollback restores the previous Shell deployment or gateway route; it does not maintain a second copy of Party UI.
