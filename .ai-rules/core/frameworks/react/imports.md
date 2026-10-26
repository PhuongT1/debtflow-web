# Imports and public APIs

Read when adding imports, changing exports, or crossing feature/package boundaries. Start with the [React rule index](README.md) for scope and selection.

## Choose the import path

Use configured aliases for cross-feature imports and declared package exports for cross-package imports. Resolve aliases from the target project's compiler/bundler configuration; do not assume `@/`, a monorepo or a shared UI package exists. Internal feature imports stay direct; do not reach into another feature's private files.

- Do not use `../../` or deeper application imports; do not use aliases to conceal an app/package boundary violation.
- Respect package `exports`. A subpath is valid only when the package deliberately publishes it; do not assume a particular package or subpath exists.
- Each workspace must declare the runtime packages it imports in its own `package.json`; package-manager hoisting is not a declaration.
- Use type-only imports for types. Keep side-effect imports deliberate, such as the framework-owned global stylesheet.
- Group new imports coherently: directives first, third-party/framework imports, public workspace packages, app aliases, then local modules. Keep relative order for imports whose side effects depend on order. Do not re-sort unrelated files.

## Public entry files

- Add a feature `index.ts` only for a real external consumer, with explicit named exports of supported components, functions, and types.
- Do not export every file, private hooks, endpoint internals, route files, or test helpers. Do not create barrels at every folder level.
- Do not mix server-only exports into an entry imported by Client Components. Prefer direct, explicit server entry points or the owning app's established server adapter.
- Preserve existing wildcard package exports until a compatibility-aware cleanup audits their consumers. New APIs must not broaden wildcard exports casually.
- Treat package exports and feature entries as contracts: document meaningful changes and check their consumers.

## Import boundary checks

| Caller                                        | Supported import                                                                                | Reject                                                                        |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| A route rendering Parties                     | `@/features/parties`                                                                            | A private `party-form.tsx` deep import instead of a published feature entry   |
| `list/party-list.tsx` reading its toolbar     | `./toolbar`                                                                                     | Importing its own feature index, which can create a cycle                     |
| Client code loading debts                     | the supported browser adapter                                                                   | a server-only adapter or a barrel re-exporting server-only code               |
| Reusing confirmation presentation             | the configured public UI export                                                                 | a private internal package path                                               |
| Domain needing another feature's private form | Compose the published feature API at the app owner, or explicitly publish a supported component | Adding a private deep import because it is shorter than defining the boundary |

### Export/change procedure

1. Inspect the destination's `index.ts` and package `exports`; search current consumers before changing the export name or shape.
2. Export only the new supported symbol, including a separate `export type` where needed. Do not broaden `export *` to make a single import work.
3. Check the entire static dependency chain of a client entry. `import type` is erased, but a runtime re-export can still pull server modules into the client graph.
4. Declare new workspace dependencies in the importing workspace and update the lockfile. Re-run `check:architecture` for export/dependency changes; TypeScript resolution alone does not prove the boundary is valid.
5. Fix new violations in touched imports. Existing deep imports are migration evidence, not permission to copy the pattern.

**Accept when:** the feature never imports its own entry; client imports cannot reach server-only code; package imports use published exports; both the importer and consumer still typecheck.

Framework reference: [Next.js server/client boundaries](https://nextjs.org/docs/app/getting-started/server-and-client-components). Verify APIs against the installed Next.js version; do not introduce a framework upgrade from a documentation example.
