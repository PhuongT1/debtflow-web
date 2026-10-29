# @packages/platform-sdk

Framework-neutral browser integration API for cross-window messaging and platform capabilities. Business data still comes from `debtflow-api`; URL parameters remain the source of truth for navigation and filters.

Do not use this package as a global store. Events carry identifiers, not full business objects.

## Login navigation

`buildLoginUrl(platformOrigin, returnTo)` builds the central `/login` URL with an
encoded `callbackUrl` parameter. Callers pass their current application URL to preserve
the origin, path, query parameters, and fragment when the user signs in.

The Shell validates the destination against its configured origin allowlist before
redirecting. This helper does not validate a session or authorize a destination.

## Sign out

After an app-owned confirmation dialog, call `signOutFromPlatform(platformOrigin)`.
Shell, Partner Ops, and Payments all use this function. It fetches a CSRF token,
POSTs to `/api/auth/signout`, validates the response, and replaces the page with
the configured Platform `/login?callbackUrl=...` URL only after success, preserving
the caller's complete URL so the next login returns to the same app and page. Failures reject so the
dialog can display an error and allow retry.

Requests are same-origin: standalone deployments must proxy `/api/auth/*` to
the central Platform and forward session/CSRF cookies and response cookies.
The helper does not introduce cross-domain SSO or store tokens in browser state.
Do not link account controls directly to the Auth.js sign-out confirmation page.

The Shell accepts `callbackUrl` as the canonical destination parameter and still
accepts older `returnTo` links. Both use the same origin allowlist validation.

## Run check

```bash
npm run typecheck -w @packages/platform-sdk
```

## Overlay transport

`openPlatformOverlay({ request, hostOrigin, signal })` returns a correlated `completed`, `cancelled` or `failed` result. It is framework-neutral; UI registration, modal rendering and domain cache refresh belong to their respective owners. See [Cross-Application Overlays](../../../docs/architecture/overlays/README.md) for setup and lifecycle.

The overlay API is browser JavaScript/TypeScript and imports no UI framework:

- `emitOverlayMessage` / `listenOverlayMessages`: common validated peer channel; the latter returns an unsubscribe function.
- `openPlatformOverlay`: caller request and correlated result, including `result.data`.
- `createOverlayHostBridge`: host transport/lifecycle callbacks; render the host UI in its own framework.
- `connectOverlaySurface`: content input, close requests, measured presentation and completion; render the content in its own framework.

See the [message reference](../../../docs/architecture/overlays/protocol.md) and [framework examples](../../../docs/architecture/overlays/examples.md). UI adapters must retain the rendered content until host exit completes.

## Package mapping

`@packages/platform-sdk` resolves to `packages/platform/sdk/src/index.ts` through the workspace package exports. See [Messaging](../../../docs/architecture/messaging/README.md) for the application client, native dispatcher and event reference.
