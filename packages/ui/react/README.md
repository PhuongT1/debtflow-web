# @packages/ui-react

Shared platform theme, providers and feedback primitives. It contains no Debt/Party business logic and no API client.

`AppShell` is imported from `@packages/ui-react` (or `@packages/ui-react/adapters/next`) and accepts an optional `onSignOut` callback so hosts can provide a confirmation dialog and own session cleanup. When supplied, selecting Sign out calls it without navigating. Otherwise the existing `signOutHref` link is retained. The Shell app provides this behavior through its `AuthenticatedShell` feature in both authenticated route layouts.

`SignOutDialog` provides the shared React confirmation UI for Shell and Partner Ops. Mount it when requested and pass translated `title`, `confirmation`, `cancelLabel`, and `errorMessage`, plus `onCancel` and async `onConfirm`. It handles pending state, keyboard focus, and errors; hosts invoke `signOutFromPlatform` from `@packages/platform-sdk` as the action. Payments provides an Angular native-dialog equivalent and uses the same SDK function.

`AppLocaleMenu` is the shared Vietnamese/English selector used by authenticated headers and public page layouts. Import it from `@packages/ui-react` and provide `locale` and `onLocaleChange`. The host owns persistence and translation updates; the menu owns only presentation and selection.

## Shared data tables

Import `DataTable`, `DataTableContent`, column types and pagination primitives through `@packages/ui-react`. Shell and Partner Ops adapters both render this implementation; do not copy table markup into a new app.

- `DataTable` owns the /debts-style surface: title and filters outside the border, a scrolling table with a sticky header/fixed columns, and a separate footer for pagination.
- `DataTableContent` is the same header/body renderer for domain compositions such as the partner debt summary, where the feature already owns a `TableLayout`, filters and focus mode.
- Columns supply `title`, `render`, optional `align`, `width`, `fixed` (`left`/`right`) and skeleton specifications. Give fixed columns explicit widths so offsets can be computed. Below the small breakpoint, columns scroll normally to avoid overlapping fixed left/right regions on phones. Pass `rowKey` for stable identity.
- Consumers own queries, URL construction, sorting, translations, actions and navigation. `renderHeader` supports an app's sort contract; `pagination` accepts its control adapter. `createTablePaginationLinks` builds serializable href data for URL-driven pagination.
- `DataTablePagination` shares summary/control alignment and loading presentation. `TablePaginationBar` also supports callback-based pagination; it keeps controls together and contains horizontal overflow on narrow screens.
- Loading skeletons, empty-state presentation and sticky offsets have one implementation. Labels and optional state icons are supplied by the consumer; the shared package does not assume a locale, endpoint or feature.

`DataTable`/`DataTableContent` can render in a Server Component. A server caller must execute column renderers and URL builders there; do not pass callback-bearing column arrays directly across a client boundary. Client features such as Parties and partner summary can supply callbacks normally. The local adapters preserve existing server/client and embedded-navigation contracts.

## Run check

```bash
npm run typecheck -w @packages/ui-react
```

Change the common MUI theme in `src/providers/app-theme.ts`. Both frontend zones receive it after rebuilding. Feature-specific components remain inside their owning app to avoid a coupled "shared everything" package.

## Source families

`src/components/table/data-table/` owns table composition/content/loading/state/types; lower-level table primitives stay in `components/table/`. Other UI families have `auth/`, `pagination/`, `layout/` and `overlays/` folders. `providers/` owns theme, query-cache and toast integration; `icons/` owns React icons.

Next.js-dependent shell and URL-pagination components live under `src/adapters/next/`. The package facade `@packages/ui-react` exports supported components, props and functions, including `AppShell` and `AppPaginationLinks`. Their focused entry `@packages/ui-react/adapters/next` remains available and resolves to the same implementations. `@packages/ui-react/core` excludes Next adapters entirely; use it when a React-only consumer needs dependency isolation. Next remains an optional peer, required when rendering the Next adapters. Root-import tree shaking is checked with a production bundler; it is not guaranteed merely by an `index.ts` filename. The installed design system is React/MUI; these are not Angular components.

`ListPageSkeleton` renders a neutral list-page placeholder from an explicit layout specification. It uses the named `page-viewport` container for responsive rules, shares table primitives and fixed-column offsets, and measures the visible body for placeholder row count. `frame` adds the same viewport padding used by an embedded page. Apps provide their composition metadata; the shared component contains no Parties-specific fields, translations or API calls.

## Empty table states

`DataTableContent` automatically centers empty feedback in its visible scrollport, even when the table is wider than the viewport or has fixed columns. A container-relative width and horizontal sticky positioning keep the message stationary while scrolling; the empty body fills its available height. Column definitions remain unchanged, so callers need no empty-specific fixed-column prop. The default icon is a decorative empty inbox. Pass `emptyIcon` to customize it or `null` to omit it.

## Platform overlays

Public `PlatformDialog`, `OverlayHost`, `OverlaySurface` and `useOverlaySurface` provide the React/MUI UI adapter. Host modality and remote domain content remain separate. See [Cross-Application Overlays](../../../docs/architecture/overlays/README.md) for the source map, registered routes, standalone/embedded behavior, close guards and adoption steps.

## Package map

`@packages/ui-react` → `packages/ui/react/src/index.ts`. `@packages/ui-react/adapters/next` → `src/adapters/next/index.ts`. See [Shared Package Boundaries](../../../docs/architecture/packages.md) before extending the public API. Branding and navigation configuration remain project choices; importing this package does not install another project's domain flows.

## Public imports

```ts
import { DataTable, AppShell } from '@packages/ui-react';
import type { DataTableProps, AppShellProps } from '@packages/ui-react';
```

Each capability index exports its supported components and public props; the root aggregates them. Implementation files use direct sibling imports to avoid cycles. No `use client` directive is added to public barrels: server/client ownership stays at each component. See [Module Imports](../../../docs/engineering/module-imports.md) for authoring and verification.

## Shared form controls and filter layout

Import `AppButton`, `AppInput`, `AppSelect`, `AppDatePicker`, and `FilterToolbar` from
`@packages/ui-react`. Their public props types use the same names with a `Props`
suffix. Text/select controls retain MUI props, refs and slots; the date adapter
accepts `YYYY-MM-DD` strings and reports an empty string for a cleared value.
Date pickers require the existing MUI localization provider.

Keep the layers small: `components/form/` owns controls, `FilterToolbar` composes
responsive fields, and the feature owns form state, validation, translations and
requests. The toolbar receives `showLabel`, `hideLabel`, `columns`, and optional
`onSubmit`; it collapses filters below `md` and preserves keyboard submission.
Shell and Partner Ops local adapters provide translated labels without duplicating
control markup.

Visual policy belongs in `providers/theme/`: `palette.ts`, `typography.ts`, and
`components/form-controls.ts` and `components/buttons.ts`, composed by `app-theme.ts` from `@packages/ui-tokens`. Do not
add feature-specific control colors or repeat field sizing in each app. Normal
small fields share a 40px minimum height; multiline and explicit size overrides
retain their MUI behavior. Configure screen-specific grid columns in the feature's
layout specification and reuse that specification for its loading skeleton.

This separates reusable controls, composition and feature screens, following the
same responsibility boundaries described in [Minimals structure](https://docs.minimals.cc/structure/)
and [MUI theme components](https://mui.com/material-ui/customization/theme-components/).

## Density, picker icons and dismissal layers

`DataTable` / `DataTableContent` accept `size="small" | "medium" | "large"`.
Their minimum row heights are 48/56/64px, with 6/10/14px vertical cell padding;
medium is the default. Rows can grow for multi-line content. Avoid incidental
paragraph margins inside cells. The matching skeleton receives the same size;
list-page metadata supplies `size` instead of copying pixel heights per app.

`AppDatePicker` adapts string dates to MUI X and shares outlined calendar/chevron
icons with the control family. It forwards supported picker props, slots and
slot props, including disabled/error states. Caller slot customizations are
merged with the shared defaults rather than dropped.

`AppIconBadge` provides a 36px soft semantic tile with a 20px outline icon. Pass
`name` and optional `tone` (primary, success, warning, error or info); it works
with CSS theme roles on server and client without requiring theme callbacks.

Invisible menu/select dismissal backdrops are always transparent. Visible modal
backdrops use the semantic backdrop color. Keep these policies in MUI overrides;
never tint every `MuiBackdrop` indiscriminately. Radius roles are 6px for small
internal elements, 8px for controls and 12px for cards/floating surfaces.
