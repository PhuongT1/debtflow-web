# @debtflow/react-ui

Shared platform theme, providers and feedback primitives. It contains no Debt/Party business logic and no API client.

`AppShell` accepts an optional `onSignOut` callback so hosts can provide a confirmation dialog and own session cleanup. When supplied, selecting Sign out calls it without navigating. Otherwise the existing `signOutHref` link is retained. The Shell app provides this behavior through its `AuthenticatedShell` feature in both authenticated route layouts.

`SignOutDialog` provides the shared React confirmation UI for Shell and Partner Ops. Mount it when requested and pass translated `title`, `confirmation`, `cancelLabel`, and `errorMessage`, plus `onCancel` and async `onConfirm`. It handles pending state, keyboard focus, and errors; hosts invoke `signOutFromPlatform` from `@debtflow/platform-sdk` as the action. Payments provides an Angular native-dialog equivalent and uses the same SDK function.

`AppLocaleMenu` is the shared Vietnamese/English selector used by authenticated headers and public page layouts. Import it from `@debtflow/react-ui` and provide `locale` and `onLocaleChange`. The host owns persistence and translation updates; the menu owns only presentation and selection.

## Run check

```bash
npm run typecheck -w @debtflow/react-ui
```

Change the common MUI theme in `src/app-providers.tsx`. Both frontend zones receive it after rebuilding. Feature-specific components remain inside their owning app to avoid a coupled "shared everything" package.
