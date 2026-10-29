# Placement

**Activate:** creating or moving a file. **Scope:** this responsibility only; apply project facts and the selected task workflow.

Use the narrowest owner that explains why the code exists. Paths below illustrate a feature-based layout; the project profile defines its actual equivalents. Do not require `src/app/`, shared packages or a monorepo in a plain React app.

| Responsibility                                                             | Location                                                                               | Must not contain                                                  |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Route entry, route layout, metadata, loading/error boundary                | `src/app/`                                                                             | Substantial reusable domain workflows                             |
| Domain screen, form, table, domain hook, query definitions, schema, mapper | `src/features/<domain>/`                                                               | Another deployable app's implementation                           |
| Presentation reused by unrelated features in one app                       | `src/components/ui/`, `src/components/tables/`, or another existing presentation group | Domain endpoint selection, authentication policy, feature imports |
| App layout chrome or composition                                           | Existing `src/components/layouts/` or the app-owned composition layer                  | Duplicated domain logic                                           |
| Reusable technical capability: HTTP, environment, routing, formatting      | `src/lib/<concern>/` or the established equivalent                                     | Page JSX, feature workflows, a catch-all utility collection       |
| A stateful hook used by one domain                                         | Beside its consumers in `features/<domain>/`, optionally its `hooks/` subfolder        | Unrelated domains' state                                          |
| A technical hook reused across unrelated features                          | Its existing `lib/<concern>/` owner                                                    | A new parallel global hooks layer without a durable need          |
| Presentation reused by multiple React apps                                 | The project-owned React UI package, if one exists                                      | App imports, credentials, domain API calls                        |
| Cross-framework visual values                                              | The existing shared design-token owner                                                 | React/Angular components                                          |
| Framework-neutral data contracts                                           | The existing neutral contract owner                                                    | Mutable stores, UI, framework runtime imports                     |
| Small cross-app browser integration helpers                                | The existing browser integration owner                                                 | Business state or React hooks                                     |

A function stays beside its only consumer when it is small and cohesive. Extract a module when it has an independent responsibility, meaningful tests, or reuse. Do not create `utils.ts`, `helpers.ts`, `common.ts`, or `shared/` to avoid choosing an owner.

Use the owning project's established adapter layer. Do not create competing HTTP clients or adapters for one endpoint.

Keep framework-specific implementations in explicit adapter folders. A package root may deliberately re-export these components alongside its general React API for convenient imports; keep a focused adapter entry and a core entry when consumers need dependency isolation. Both entries must resolve to the same implementation, not copied wrappers. Keep matching types beside their capability and export public component props. Check server/client boundaries, circular imports and production tree shaking before claiming unused adapters are excluded. The project profile defines actual names and source maps.
