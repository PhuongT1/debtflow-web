# Authentication and Session Rules

- The Shell/Platform owns login, logout, session lifecycle, and user-facing account controls.
- MFEs consume only the minimum identity/session capability required for their work; they must not own credentials or duplicate login flows.
- Never transmit access tokens through URL query strings, cross-window events, logs, or shared browser storage.
- Return targets must be validated against an allowlist before redirecting.
- Cross-domain production SSO must use an approved identity/session handoff design. Local same-origin proxy behavior is not proof of a secure production SSO implementation.
