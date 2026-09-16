# Security Rules

- Never commit secrets, credentials, API keys, private URLs, or local environment files.
- Validate untrusted API and cross-window data at runtime at the boundary.
- Keep tokens out of URLs, browser events, logs, and shared state.
- Use explicit origin allowlists for cross-window communication in production.
