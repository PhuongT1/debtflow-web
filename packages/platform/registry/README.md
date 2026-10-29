# @packages/platform-registry

Framework-neutral, versioned registry for route ownership, Platform layout policy and runtime composition.

Applications may consume this package, but must never import another deployable app. Runtime origins remain environment variables; no deployment URL is committed here.

## Loading presentation metadata

`partnerListLayout` is a declarative composition contract used by the Parties toolbar/table and by `ListPageSkeleton` in both apps. `getApplicationLoadingLayout(name)` selects supported metadata without app-private imports. Keep column widths, responsive grid and row density here; this module contains no React components, business state, services or credentials. Changes require checking the placeholder and real page at the same embedded widths.

## Source ownership

`src/registry.types.ts` owns registry types; `manifest.ts` exposes the JSON manifest. `loading-layouts.ts` and `overlays.ts` resolve registered configuration. App-specific data lives in `src/registrations/<app>/`; Partner Ops defines `loading-layout.ts` and `overlay-routes.ts` there. Register another application in its own folder and update the resolver; never import that application's private UI.
