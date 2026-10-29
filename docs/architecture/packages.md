# Shared Package Boundaries

Packages are grouped by responsibility. The `@packages/` prefix identifies shared workspace code: `@packages/<group>-<name>` maps to `packages/<group>/<name>`; `platform/` and `ui/` are grouping folders, not packages themselves.

```text
packages/
  platform/
    contracts/       @packages/platform-contracts
    navigation/      @packages/platform-navigation
    registry/        @packages/platform-registry
    sdk/             @packages/platform-sdk
  ui/
    react/           @packages/ui-react
    tokens/          @packages/ui-tokens
```

## Choose the owner

| Import                             | Source                                                              | Owns                                                        | Must not own                                          |
| ---------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `@packages/platform-contracts`     | [contracts](../../packages/platform/contracts/README.md)            | Shared models, constants and wire validators                | Browser I/O, UI or mutable stores                     |
| `@packages/platform-navigation`    | [navigation](../../packages/platform/navigation/README.md)          | Project menu/route ownership, label resolution              | Router execution or UI                                |
| `@packages/platform-registry`      | [registry](../../packages/platform/registry/README.md)              | App manifest and project view/loading registration          | Components or domain API calls                        |
| `@packages/platform-sdk`           | [sdk](../../packages/platform/sdk/README.md)                        | Cross-window messaging, locale storage and auth navigation  | Domain state or UI framework imports                  |
| `@packages/ui-tokens`              | [tokens](../../packages/ui/tokens/README.md)                        | Framework-neutral visual values, TypeScript and CSS         | React/Angular components                              |
| `@packages/ui-react`               | [react](../../packages/ui/react/README.md)                          | Supported React UI, providers and named Next facade exports | Domain services or duplicated adapter implementations |
| `@packages/ui-react/adapters/next` | [Next adapters](../../packages/ui/react/src/adapters/next/index.ts) | Next.js shell/routing and URL pagination                    | A second implementation of common UI                  |

`@packages/ui-react/adapters/next` is a subpath export of the React package, not another workspace. It maps to `packages/ui/react/src/adapters/next/index.ts`. Both `@packages/ui-react` and this focused entry export `AppShell` and `AppPaginationLinks` from the same implementation. `@packages/ui-react/core` maps to `src/core.ts` and excludes the Next adapter graph for consumers that need isolation. Angular uses the neutral packages and tokens, not React UI.

## Import examples

```ts
import type { AuthUser } from '@packages/platform-contracts';
import { createPlatformClient } from '@packages/platform-sdk';
import { designTokens } from '@packages/ui-tokens';
import { AppShell, DataTable, PlatformDialog, AppPaginationLinks } from '@packages/ui-react';
import type { DataTableProps, AppShellProps } from '@packages/ui-react';
```

```css
@import '@packages/ui-tokens/tokens.css';
```

Import through these public exports. Do not reach into `src/`, import another app's private implementation or introduce path aliases that disguise a workspace dependency.

## Internal organization

| Package    | Find the implementation                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------ |
| Contracts  | `src/auth`, `api`, `i18n`, `mfe`, `payments`; types beside their contract                                          |
| Navigation | `navigation.types.ts`, `navigation-items.ts`, `navigation-label.ts`; index only exports                            |
| Registry   | `registry.types.ts`, `manifest.ts`, `loading-layouts.ts`, `overlays.ts`; project data under `registrations/<app>/` |
| SDK        | `messaging`, `overlays`, `auth`, `navigation`, `storage`, `event-bus`                                              |
| React UI   | `components/<capability>`, `providers`, `icons`; framework routing under `adapters/next`                           |
| Tokens     | One cohesive token definition and matching `tokens.css`; no extra wrapper folders                                  |

Create a subfolder for a real family, not for every file. Keep types beside their owner, ordinary implementation imports direct and public indexes explicit. The root-level `platform/` outside `packages/` holds deployment/manifests infrastructure; it is not this runtime package group.

## Reuse and checks

Neutral means framework-independent, not automatically project-independent. Navigation, app registrations, branding and visual values reflect this project's choices; replace that configuration when adopting elsewhere. Domain features stay in their app.

`npm run check:architecture` verifies package-name/path matching, declared dependencies, neutral boundaries and Next import placement. It must still discover **9 workspaces** (3 apps, 6 packages). Run `npm run typecheck`, affected lint/build/browser checks and `npm run rules:check` after a public move. Successful lint alone does not establish behavior equivalence.

Canonical rules: [package owner instructions](../../packages/AGENTS.md), [MFE boundaries](../../.ai-rules/core/standards/microfrontend.md) and [shared changes](../../.ai-rules/core/execution/shared-code.md).

See [Module Imports](../engineering/module-imports.md) for module indexes, type exports, optional subpaths and Angular entrypoints.
