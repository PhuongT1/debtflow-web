# Add a frontend zone (Angular, React, Vue or another framework)

This repository uses route composition. A new zone is a real application, not a folder of React components imported by Shell.

## Required boundary

Choose one exclusive business capability and URL prefix. Example:

```text
collection-ops owns /collections/**
```

Do not let Shell and the new application implement the same route. Shared business state remains in `debtflow-api`; filters and selected IDs belong in the URL.

## Create the application

Create it under `apps/<zone-name>` with its own `package.json`, framework dependencies, environment example, build command and README. For Angular, run the Angular CLI with npm and place the generated project under `apps/collection-ops`. Do not add Angular packages to Shell or Partner Operations.

The application may depend on:

- `@debtflow/contracts`
- `@debtflow/navigation`
- `@debtflow/design-tokens` and `@debtflow/design-tokens/tokens.css`
- `@debtflow/platform-sdk`

It must not depend on:

- `@debtflow/react-app-shell`
- `@debtflow/react-ui`
- another application under `apps/*`

If Angular needs reusable framework components, create `packages/angular-ui` or `packages/angular-app-shell`. Those adapters may consume the neutral packages but are not dependencies of React zones.

## Integrate the route

1. Give the zone a unique local port and static-asset prefix.
2. Add its origin and release switch to Shell environment validation.
3. Add gateway rewrites for the owned route and asset prefix.
4. Add one entry in `packages/navigation` with the correct `owner`.
5. Add root `dev:<zone>`, `build:<zone>` and `check:<zone>` commands.
6. Add a path-filtered CI workflow and an independent deployment.
7. Test both its direct URL and the public URL through Shell/gateway.

The public domain should stay stable. For example, users open `/collections`; the reverse proxy decides which deployment serves it. This works with Vercel today and with Nginx, Kubernetes Ingress, Cloudflare or another gateway later.

## Authentication and communication

- Use a server-side session/API endpoint or standards-based OIDC/OAuth flow; do not import Shell auth code.
- Use HTTP/JSON contracts for business data.
- Use URL path/query for navigation state.
- Use `platform-sdk` only for small, versioned browser notifications.
- Never share a mutable Redux, React Query, Angular service or in-memory store between zones.

## Definition of done

The new zone is valid only when it can:

1. install and build without importing another app;
2. run directly for isolation testing;
3. run through the gateway on its public route;
4. fail or roll back without stopping unrelated zones;
5. deploy using its own artifact and environment variables.
