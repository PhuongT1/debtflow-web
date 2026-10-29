# Debtflow Authentication

**Activate:** authentication changes in Debtflow; load only this selected local extension.

- The Shell/Platform owns login, logout, session lifecycle, and user-facing account controls.
- Standalone account controls must open a translated confirmation dialog and call `signOutFromPlatform` from `@packages/platform-sdk` only after confirmation. Use the configured same-origin Platform API proxy; never navigate to `/api/auth/signout`. React hosts reuse `SignOutDialog` from `@packages/ui-react`; Angular hosts use their native dialog equivalent.
- MFEs consume only the minimum identity/session capability required for their work; they must not own credentials or duplicate login flows.
- Preserve the calling application's full URL through logout and login using the shared `buildLoginUrl`/`signOutFromPlatform` helpers and the `callbackUrl` parameter. Login must continue accepting legacy `returnTo` links and validate either parameter with the same allowlist.

Reusable policy: [authentication](../../core/concerns/authentication.md).
