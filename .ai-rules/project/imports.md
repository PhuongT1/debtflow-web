# Import Ownership

**Activate:** adding or changing source imports, public entries, aliases or shared package names in this workspace.

The import prefix identifies the owner. Keep component/function/type names descriptive and consume its maintained public entry.

| Prefix / example                       | Ownership                                        | Physical source                                                       |
| -------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| `@packages/ui-react`                   | Shared workspace React UI                        | `packages/ui/react/src/index.ts`                                      |
| `@packages/platform-sdk`               | Shared workspace browser integration             | `packages/platform/sdk/src/index.ts`                                  |
| `@packages/<group>-<name>`             | Shared workspace package                         | `packages/<group>/<name>`; package exports select the entry           |
| `@/features/parties`                   | Parties domain in the current React app          | That app's `src/features/parties/index.ts`                            |
| `@/services/parties`                   | Parties service API in the current React app     | That app's `src/services/parties/index.ts`                            |
| `@/components/...`                     | Presentation shared inside the current React app | That app's `src/components/`                                          |
| `@features/payments`                   | Payments domain in the current Angular app       | `apps/payments/src/app/features/payments/index.ts`                    |
| `@shared/...`, `@core/...`, `@app/...` | App-local Angular capabilities                   | Configured paths in that Angular app, never workspace-global packages |
| `./...`, `../...`                      | Internal module/feature implementation           | Sibling or cohesive owner; follow owner relative-import limits        |

`@packages/` is a real npm workspace package scope, reserved for shared packages. It is not a TypeScript alias to an app or to arbitrary source. Name each package `@packages/<group>-<name>` to map to `packages/<group>/<name>`; public subpaths continue beneath that package's configured exports. Do not use the older `@ui/` or `@platform/` names as parallel aliases.

Shared means workspace ownership, not universal compatibility: React UI is still React-only, and project registration remains local configuration. Third-party imports keep their vendor names, such as `react`, `antd` and `@angular/core`.

Across a domain boundary, import its public entry and retain the domain name. Inside it, import sibling implementations/types directly to avoid self-barrel cycles. Keep explicit server/client suffixes or focused entries when they identify a real runtime boundary; shortening an import does not justify combining server-only and browser-only services.

After changing a namespace, update all consumers, package manifests/exports, build configuration, lockfile, boundary checks and human examples. `npm run check:architecture` enforces package name/path mapping and rejects app-local aliases under `@packages/`. Run owner typechecks/builds and verify standalone/embedded consumers as relevant.
