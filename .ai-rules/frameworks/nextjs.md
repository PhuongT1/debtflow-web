# Next.js Rules

- Use the App Router already established by this repository.
- Prefer Server Components. Add `"use client"` only at the smallest boundary that needs browser APIs, event handlers, or client state.
- Do not import server-only modules into Client Components, or expose non-`NEXT_PUBLIC_` environment variables to browser code.
- Use `next/navigation` APIs for internal navigation. Preserve query parameters required for deep links.
- Treat `next.config.ts`, rewrites, metadata, and provider boundaries as build-sensitive; run the app build after changing them.
- Keep server data access and browser-only MFE bridge code separate.
- Do not introduce locale route segments unless an explicit product decision changes the current no-locale-routing model.

## Application layering

- Keep `app/` thin: it owns routes, layouts, metadata, loading/error boundaries, and composition. Move reusable UI and business flows out of route files.
- Organize domain work in `features/<feature-name>/`. A feature owns its UI, hooks, state, API adapters, and tests; consumers use its public surface rather than its internals.
- Put reusable presentation-only UI in `components/`, cross-cutting browser/server helpers in `lib/`, and external integrations behind a feature adapter or a clearly named service module.
- Do not import a feature internal file from another feature. Expose an intentional consumer-facing API through that feature `index.ts` only when the API is stable and small.
- Follow the existing structure first. Introduce a new top-level layer only when it represents a durable responsibility; do not create generic `utils`, `common`, or `shared` dumping grounds.

## Imports

- In Shell and Partner Ops, `@/` resolves to that app `src/` directory. Use it for cross-feature, app-layer, or shared source imports: `@/features/debts`, `@/components/ui/button`.
- Do not use `@/` to escape into files outside `src/`; configure a dedicated alias instead when a supported app-owned root is needed.
- Keep App Router route files and colocated route implementation imports relative when they stay within the same route segment. Do not create an index for Next.js special files.
- A feature index is allowed only for its stable consumer-facing surface; use explicit exports and keep server/client boundaries visible.

## App Router naming

- In `app/`, keep Next.js special file names exactly as required: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx`, and `template.tsx`.
- Use lowercase kebab-case for ordinary route segment folders. Use Next conventions for route groups `(group)`, dynamic segments `[id]`, catch-all segments `[...slug]`, private folders `_folder`, and slots `@slot`.
- Components colocated beside an App Router route still use ordinary React kebab-case `.tsx` names, for example `login-form.tsx`.
