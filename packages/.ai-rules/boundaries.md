# Shared Package Boundaries

- A shared package has one cohesive purpose, an explicit framework boundary and a documented public API.
- Do not add application workflows to a shared package merely to avoid local implementation.
- Dependency direction is app -> package; a package must not import a deployable app.
- Shared package imports use the real `@packages/` namespace: `@packages/<group>-<name>` maps to `packages/<group>/<name>`. Follow [Import Ownership](../../.ai-rules/project/imports.md); reserve app/domain aliases for their local owners. Update manifests, consumers, checks and documentation with a rename.
- `platform/contracts` owns shared models and wire validators; `platform/sdk` owns browser integration; `platform/navigation` and `platform/registry` own project configuration. UI packages own presentation and framework adapters.
- `@packages/ui-react` is the convenient public facade for supported UI and Next adapters; `@packages/ui-react/adapters/next` exposes the same adapter implementations. `@packages/ui-react/core` excludes the Next adapter graph for framework-independent React consumers. Keep `next/*` implementation imports in the adapter folder, while allowing explicit named root re-exports. Export public components and props through capability indexes; internal files must not import their own facade. Angular uses neutral platform packages and `@packages/ui-tokens`, never React UI.
- Prefer additive exports. Update consumers and package documentation when a public API changes.
- Run the package typecheck and `npm run check:architecture` after boundary, export, or dependency changes.
