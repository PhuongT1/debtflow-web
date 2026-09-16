# API and Shared Contract Rules

- `@debtflow/contracts` contains framework-neutral types and versioned message schemas only: no UI, network calls, environment access, secrets, mutable state, or domain services.
- Prefer additive contract changes. For breaking changes, introduce a new version and retain compatibility until all consumers migrate.
- Validate data received from API or `postMessage` at runtime when it crosses a trust boundary.
- Keep API ownership in the domain application; shared contracts describe data, not business workflows.
