# Module Imports

Expose a clear public API at each reusable module, then aggregate supported APIs at the package root. Consumers can import briefly without knowing private filenames.

## Identify the owner from the import

| Import                     | Comes from                                             |
| -------------------------- | ------------------------------------------------------ |
| `@packages/ui-react`       | Shared workspace package: `packages/ui/react`          |
| `@packages/platform-sdk`   | Shared workspace package: `packages/platform/sdk`      |
| `@/features/parties`       | Parties domain inside the current React app            |
| `@/services/parties`       | Parties service inside the current React app           |
| `@/components/ui/button`   | Shared presentation inside the current app, not global |
| `@features/payments`       | Payments domain inside the Angular app                 |
| `@shared/...`, `@core/...` | App-local Angular aliases, not workspace packages      |
| `./...`                    | This module's own implementation                       |

`@packages/` is the actual package scope, not an alias disguising a local file. The suffix retains the group/capability (`ui-react`, `platform-sdk`); domain imports retain their domain name. Shared location does not make a React component usable in Angular. The canonical namespace policy is [Import Ownership](../../.ai-rules/project/imports.md).

## Usage

```ts
import { AppShell, DataTable, PlatformDialog } from '@packages/ui-react';
import type { AppShellProps, DataTableProps } from '@packages/ui-react';
```

Optional focused entries are also supported:

```ts
import { AppShell } from '@packages/ui-react/adapters/next';
import { DataTable } from '@packages/ui-react/core';
```

The root and adapter imports refer to the same AppShell, not duplicate wrappers. The core entry excludes the Next adapter graph; a consumer rendering AppShell still needs Next and its router context. Do not force the detailed path when the root already exports the required API.

## Build a module API

Keep implementation and types beside the capability; give outside consumers a public `index.ts`:

```text
components/overlays/
  index.ts              Public components, hooks and props
  dialog.tsx            Implementation with its own client boundary
  host.tsx
  surface.tsx
  overlay.types.ts      Named options and props
```

```ts
export { PlatformDialog } from './dialog';
export { OverlayHost } from './host';
export { OverlaySurface, useOverlaySurface } from './surface';
export type { PlatformDialogProps, OverlayHostProps } from './overlay.types';
```

Then export that supported API from the package facade. Package `exports` must map the root and any public subpaths to their actual source entries. Use explicit named exports and type-only exports. Export public components/functions and their contracts; retain rendering helpers and implementation details as private.

Inside the module, import the sibling implementation/type directly. Importing its own index creates a cycle. Across module boundaries, prefer the public entry, such as `@/features/parties`, rather than private `form/party-form` files. Do not put `use client` on a barrel containing both server and client APIs.

## Angular uses ES module exports too

Current Angular feature entries use the same syntax:

```ts
import { PaymentWorkspaceComponent } from '@features/workspace';
import { PaymentHistoryComponent } from '@features/payments';
```

Standalone components still list their component imports normally; an index does not declare components or register providers. A published Angular component library uses the builder-configured `public-api.ts` (or `lib.entryFile`) and Angular Package Format. An index alone does not replace ng-packagr/AOT or turn React components into Angular components.

## Verification

| Change                           | Check                                                                  |
| -------------------------------- | ---------------------------------------------------------------------- |
| Public component or props export | Typecheck and root/subpath export contract tests                       |
| Module index                     | Runtime import-cycle check; do not expose private files automatically  |
| Root/adapter facade              | Both paths resolve to the same exported symbol                         |
| Side-effect metadata             | Preserve CSS and required initialization; inspect a production bundle  |
| React/Next entry                 | Preserve server/client boundaries; production build and browser checks |
| Angular entry                    | Angular typecheck, AOT build and affected component tests              |

The UI package marks CSS as side-effectful. Do not add side-effect metadata to another owner without inspecting its initialization. The bundle smoke check confirms that a root import of AppPagination drops unused Next adapters; a core import is also checked while rejecting any Next resolution. This is scoped evidence, not a promise about every bundler/plugin configuration.

## References and local policy

Ant Design uses a [package component index](https://github.com/ant-design/ant-design/blob/master/components/index.ts) and [component-level indexes](https://github.com/ant-design/ant-design/blob/master/components/button/index.tsx); its [ES module import guide](https://ant.design/docs/react/getting-started/#import-on-demand) documents tree shaking. We retain this project's existing named implementation exports instead of copying another library's default-export style.

Angular documents [public library APIs and entrypoints](https://angular.dev/tools/libraries/creating-libraries) and [Angular Package Format](https://angular.dev/tools/libraries/angular-package-format). Canonical project requirements live in [code style](../../.ai-rules/core/standards/code-style.md), [package boundaries](../../packages/.ai-rules/boundaries.md) and [Angular rules](../../.ai-rules/core/frameworks/angular/README.md).
