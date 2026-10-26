# @debtflow/react-ui

Shared platform theme, providers and feedback primitives. It contains no Debt/Party business logic and no API client.

`AppShell` accepts an optional `onSignOut` callback so hosts can provide a confirmation dialog and own session cleanup. When supplied, selecting Sign out calls it without navigating. Otherwise the existing `signOutHref` link is retained. The Shell app provides this behavior through its `AuthenticatedShell` feature in both authenticated route layouts.

`SignOutDialog` provides the shared React confirmation UI for Shell and Partner Ops. Mount it when requested and pass translated `title`, `confirmation`, `cancelLabel`, and `errorMessage`, plus `onCancel` and async `onConfirm`. It handles pending state, keyboard focus, and errors; hosts invoke `signOutFromPlatform` from `@debtflow/platform-sdk` as the action. Payments provides an Angular native-dialog equivalent and uses the same SDK function.

`AppLocaleMenu` is the shared Vietnamese/English selector used by authenticated headers and public page layouts. Import it from `@debtflow/react-ui` and provide `locale` and `onLocaleChange`. The host owns persistence and translation updates; the menu owns only presentation and selection.

## Shared data tables

Import `DataTable`, `DataTableContent`, column types and pagination primitives through `@debtflow/react-ui`. Shell and Partner Ops adapters both render this implementation; do not copy table markup into a new app.

- `DataTable` owns the /debts-style surface: title and filters outside the border, a scrolling table with a sticky header/fixed columns, and a separate footer for pagination.
- `DataTableContent` is the same header/body renderer for domain compositions such as the partner debt summary, where the feature already owns a `TableLayout`, filters and focus mode.
- Columns supply `title`, `render`, optional `align`, `width`, `fixed` (`left`/`right`) and skeleton specifications. Give fixed columns explicit widths so offsets can be computed. Below the small breakpoint, columns scroll normally to avoid overlapping fixed left/right regions on phones. Pass `rowKey` for stable identity.
- Consumers own queries, URL construction, sorting, translations, actions and navigation. `renderHeader` supports an app's sort contract; `pagination` accepts its control adapter. `createTablePaginationLinks` builds serializable href data for URL-driven pagination.
- `DataTablePagination` shares summary/control alignment and loading presentation. `TablePaginationBar` also supports callback-based pagination; it keeps controls together and contains horizontal overflow on narrow screens.
- Loading skeletons, empty-state presentation and sticky offsets have one implementation. Labels and optional state icons are supplied by the consumer; the shared package does not assume a locale, endpoint or feature.

`DataTable`/`DataTableContent` can render in a Server Component. A server caller must execute column renderers and URL builders there; do not pass callback-bearing column arrays directly across a client boundary. Client features such as Parties and partner summary can supply callbacks normally. The local adapters preserve existing server/client and embedded-navigation contracts.

## Run check

```bash
npm run typecheck -w @debtflow/react-ui
```

Change the common MUI theme in `src/providers/app-providers.tsx`. Both frontend zones receive it after rebuilding. Feature-specific components remain inside their owning app to avoid a coupled "shared everything" package.

## Source families

`src/components/table/data-table/` owns DataTable composition/content/loading/state/types; low-level cells, container, layout, pagination bar and sticky offsets stay in `src/components/table/`. Standalone pagination controls live in `components/pagination/`, authentication presentation in `components/auth/`. Shell chrome, icons and providers retain their existing capability folders. Apps import `@debtflow/react-ui`; these internal moves preserve the package exports.
