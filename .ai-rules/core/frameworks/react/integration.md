# React Integration Boundaries

**Activate:** changing locale, navigation, authentication integration or error presentation. **Scope:** React adapters, not selection of a project's identity provider or routing architecture.

- Follow the installed router and integration APIs declared by the project profile. Preserve unrelated query state and validated return destinations; do not construct redirects by concatenating untrusted strings.
- Use established translations and locale-aware formatting. Shared presentation receives labels or an explicit locale contract; it must not depend secretly on an app's provider/catalog.
- Keep authentication/session policy in its configured owner. UI calls the supported public capability; it must not duplicate transport, CSRF or credential handling.
- Distinguish invalid input, empty results, unauthorized/session state and request failures. Catch errors where recovery/presentation is possible; no empty catches or false successful empty results.
- Do not expose credentials, internal transport details or stack traces in user-facing messages or logs.
- When integrating independently deployed apps, apply [microfrontend boundaries](../../standards/microfrontend.md); ordinary single-app changes do not activate them.

**Accept when:** direct navigation, relevant locale changes, permitted/denied paths and recoverable errors work without breaking caller context. Apply [authentication](../../concerns/authentication.md), [i18n](../../concerns/i18n.md) or [API contracts](../../concerns/api-contracts.md) only when touched.
