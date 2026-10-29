# @packages/platform-sdk

Versioned browser integration API for rare cross-zone notifications. Business data still comes from `debtflow-api`; URL parameters remain the source of truth for navigation and filters.

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
