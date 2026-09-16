# Shell Architecture

- `apps/shell` is the Platform host at port 3000. It owns application composition, global header/sidebar, global locale and tenant selection, and user-facing session controls.
- Keep remote loading, rewrites, and host event handling in the MFE composition layer, not in domain feature pages.
- The Shell may render an MFE route but must not import that MFE's internal source or duplicate its domain state/UI.
- When adding a remote route, update the MFE registry/manifest and run `npm run check:architecture`.
- Validate Shell changes with `npm run typecheck:shell`; also run `npm run build:shell` for routing, composition, Next configuration, or provider changes.

## Source ownership

- Keep App Router files as adapters: route params, route-level metadata, and composition only. Put a substantial page implementation in its owning feature and import it through that feature public entry.
- `features/dashboard` owns the dashboard page; `features/debts` owns debt list/detail pages and debt workflows. New Shell domains follow the same pattern.
- `components/` contains Shell-specific presentational components. Do not add a component copied from another app: promote it to `@debtflow/react-ui` only after its API is proven stable across consumers.
- `lib/` is for cross-domain technical concerns such as auth, environment, pagination, and MFE manifest loading. It must not become a second domain-feature directory.
