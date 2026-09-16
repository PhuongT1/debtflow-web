# Angular Rules

- Follow the standalone-component architecture used by `apps/payments`.
- Keep business and shared behavior in services; keep templates/components focused on presentation and interaction.
- Prefer signals and existing RxJS patterns. Use `async` pipe or Angular lifecycle-aware utilities instead of unmanaged subscriptions.
- Use `ChangeDetectionStrategy.OnPush` for new components unless an existing local convention requires otherwise.
- Preserve the public custom-element boundary. Do not expose Angular internals to the Shell.
- Run the Payments typecheck and production build after Angular configuration, dependency, or element-boundary changes.

## Imports

- In Payments, use the configured aliases by ownership: `@app/`, `@core/`, `@features/`, `@shared/`, and `@env/`. Do not introduce a second alias for the same folder.
- Use a relative import only for a colocated component template, stylesheet, test, or same-feature sibling. Do not use `../../` or deeper imports.
- Feature-level `index.ts` files are optional public APIs for other features; export explicitly and never use them for a component's own template/style imports.
- Keep Angular compiler paths and the workspace TypeScript paths synchronized whenever an alias changes.
- A linked workspace package that an Angular app imports must be declared in that app `package.json`, even when npm currently hoists a root symlink.
- For TypeScript-source workspace packages used by `ng serve`, add the package to `angular.json` `serve.options.prebundle.exclude`. Keep `preserveSymlinks: true`; exclude only the linked package instead of disabling all prebundling.

## File naming

- Angular itself does not require a `.component.ts` suffix; its current style guide recommends consistent kebab-case names matching the primary class.
- Follow the target Angular application's local naming convention; do not apply it outside that application.
- Keep a component's TypeScript, template, stylesheet, and test files colocated and named consistently.
