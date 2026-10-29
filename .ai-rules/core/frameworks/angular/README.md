# Angular Rules

**Activate:** modifying Angular components, templates, services, routing or build configuration. **Read boundary:** installed version, target feature, compiler/build setup and owner instructions.

- Preserve the project's standalone/NgModule architecture and supported APIs. Rule adoption does not authorize a migration.
- For request/service changes, follow [HTTP ownership](../../concerns/http-client.md) with the actual configured Angular transport; do not copy React query APIs into Angular components.
- Keep business/data capabilities in the established service/domain layer. Components own presentation and interaction; templates should not hide business workflows.
- Follow installed signals/RxJS and change-detection conventions. Clean up subscriptions/resources through supported lifecycle mechanisms; do not add unmanaged subscriptions or speculative state frameworks.
- Keep component, template, styles and tests colocated according to the owner's naming convention. Do not impose React filenames or another Angular project's suffix/alias policy.
- Derive aliases from compiler and builder configuration. Synchronize both when changed; use public package exports and explicit runtime dependency declarations.
- Angular supports standard ES module exports. Consume supported components/services/types through their public entry; use a module `index.ts` for app feature APIs and the configured `public-api.ts`/`lib.entryFile` for packaged libraries. Native Angular libraries need their existing Angular Package Format/ng-packagr build, not a TypeScript barrel alone. Respect secondary-entrypoint imports required by that builder and avoid circular exports; validate with the actual Angular AOT build.
- Preserve template typing, accessible semantics, focus/keyboard behavior and recoverable async states.
- Workspace links, custom elements and host integration require the actual builder/package configuration and consumer impact analysis. Do not universally apply another app's prebundle or symlink workaround.
- Run affected owner checks; configuration, dependencies and public boundaries need the relevant production/build validation.

**Accept when:** templates compile, changed interactions work, resource ownership is correct, and affected consumers resolve. Shared boundaries also activate [impact assessment](../../execution/shared-code.md).
