# Shared Package Boundaries

- A shared package has one framework-neutral purpose and a documented public API.
- Do not add application workflows to a shared package merely to avoid local implementation.
- Dependency direction is app -> package; a package must not import a deployable app.
- `contracts` is type/schema-only; `platform-sdk` is a narrow integration API; UI packages are presentation-focused.
- Prefer additive exports. Update consumers and package documentation when a public API changes.
- Run the package typecheck and `npm run check:architecture` after boundary, export, or dependency changes.
