# Authentication Rules

**Activate:** changes to login, logout, sessions, permissions or return destinations. Use the provider, session owner, route scheme and UX specified by the project profile.

- Reuse supported authentication capabilities; do not duplicate credential, CSRF or session lifecycle handling in a UI component.
- Validate return destinations and origins before redirecting. Preserve required caller context without trusting user-supplied URLs automatically.
- Do not expose tokens through URLs, logs, cross-window events or unsupported shared storage. Apply authorization at the trusted boundary; client validation is not permission.
- Preserve configured confirmation, pending, cancellation and retry behavior. No universal logout URL, parameter name or dialog component is mandated by this module.
- For cross-app/domain identity, assess actual origins, cookies and approved handoff design; local proxy success does not establish production SSO security.

**Accept when:** permitted/denied paths, session transitions and relevant return journeys work with no secret leakage. Follow owner checks and [verification](../execution/verify.md).
