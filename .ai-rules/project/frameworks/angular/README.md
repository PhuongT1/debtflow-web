# Debtflow Angular Extension

**Activate:** Payments Angular source, aliases, custom-element or dependency/build changes.

- Payments uses standalone components; prefer its established signals/RxJS patterns and `OnPush` for new components unless the local contract requires otherwise.
- Preserve the public custom-element boundary; do not expose Angular internals to the host.
- Use configured `@app/`, `@core/`, `@features/`, `@shared/` and `@env/` aliases. Colocated/same-feature imports may remain relative; do not add competing aliases or deep parent imports.
- Keep compiler and builder paths synchronized. Declare linked workspace dependencies in Payments' own manifest.
- For its current source-linked workspace packages, retain `preserveSymlinks: true` and the targeted `serve.options.prebundle.exclude` entries; do not apply this workaround to unrelated projects or disable all prebundling.
- Run Payments typecheck and production build for configuration, dependencies and element-boundary changes using its actual scripts.

Follow the [generic Angular rules](../../../core/frameworks/angular/README.md) and the app's owner instructions; this local module does not grant an Angular architecture migration.
