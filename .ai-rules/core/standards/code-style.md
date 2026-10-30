# Code Structure, Naming, and TypeScript Rules

These are reusable defaults, not permission to migrate established code. The project profile records concrete aliases, language mode and owner conventions; report material conflicts instead of silently overriding either layer. TypeScript-specific sections apply only to TypeScript source.

## File and module size

- Keep a source file at **230 lines or fewer**, excluding generated files, declaration files, and framework-required configuration.
- Split by responsibility, not arbitrarily: extract a cohesive component, hook, service, formatter, schema, or mapper when it has its own reason to change.
- Extract cohesive responsibilities before reaching the limit; preserve a clear public entry and avoid circular imports, prop drilling or fragmented business flow. Comments and blank lines count toward the limit; generated/declaration/configuration exceptions do not apply to handwritten feature code.

## Names and paths

- Use **kebab-case** for ordinary directories and file names: `partner-ops`, `payment-history.ts`, `use-party-filters.ts`.
- Framework-specific file naming belongs in the relevant framework and application rule. Do not apply Angular suffix conventions to React/Next files.
- Use PascalCase for React component exports, Angular classes, types, interfaces, and enums: `PartnerTable`, `PaymentApiService`, `PartyFilter`.
- Use camelCase for functions, variables, object properties, hooks, and event handlers: `getPartyById`, `partyId`, `usePartyFilters`, `handleSave`.
- Use UPPER_SNAKE_CASE only for true module-level constants that never change: `DEFAULT_PAGE_SIZE`, `MAX_RETRY_COUNT`. Do not use it for ordinary local values.
- Name boolean values as questions or states: `isLoading`, `hasPermission`, `canDelete`.
- Name collections in plural and single values in singular: `parties` / `party`.
- Prefer domain words over generic names. Avoid `data`, `item`, `utils`, `helpers`, `manager`, or `common` unless the scope makes the meaning unambiguous.
- Name shared packages by their responsibility, such as contracts, navigation, integration SDK, or UI primitives. Shared usage alone is not a reason to create a `global`, `common`, or `utils` package. An SDK may target browsers, servers or mobile; its name does not imply a UI framework.
- Keep public names, directory grouping and documentation source maps consistent. A namespace may identify workspace origin, an architecture group or an organization; define its deterministic folder mapping in the project profile. Before a move or rename, update workspace discovery, manifests/lockfile, build/check scripts, tests and source links together. Verify package resolution and discovered workspace counts.

## Imports and module public APIs

- Use the configured alias when crossing an application, feature, or package boundary. Do not use `../../` or deeper parent-relative imports in application source.
- Use `./` for a sibling or child module. One `../` is allowed only within the same cohesive feature folder when it is clearer than an alias.
- Each deployable app owns its aliases. Do not copy an alias convention from a different app; configure TypeScript and the framework/bundler together before using it.
- Import shared code through the package public export, for example the project's declared contract package; never reach into another package or app `src/` directory.
- Make ownership visible in imports: use distinct project-defined namespaces for workspace-shared packages, app-local capabilities and domain public APIs. Keep the domain/capability name when shortening an import. Do not invent a global-looking alias for app-private code or make a path so generic that its owner is hidden.
- Give each reusable module/feature with outside consumers an intentional public entry (`index.ts`, or the framework's equivalent). Export its supported components, matching props/types and functions there; aggregate these entries at the package root so consumers can use a concise named import that still identifies the owner.
- A package may offer both a root facade and focused subpath exports for the same API. Do not force a deep adapter/file import when the root deliberately supports it. Declare subpaths in package exports/build configuration; document framework/dependency requirements and provide a separate core entry when isolation is needed.
- Use explicit named `export { ... }` and `export type { ... }` at public entries. Keep internal implementation imports direct; an index must not expose private helpers, framework route files or every incidental file. Avoid `export *` unless it forwards a deliberately maintained public contract.
- Before adding an index, check for circular dependencies. Public indexes must not be imported by modules that they re-export.
- Preserve server/client markers on the owning implementation modules; do not mark an entire barrel client-only merely to expose a client component. Verify actual production bundling after changing exports or side-effect metadata. Preserve CSS/required initialization; do not assume a short import automatically guarantees tree shaking.

## Domain values and navigation

- Repeated business statuses, modes and discriminators use the owning domain's existing typed constants/enums. Keep wire values compatible; do not introduce a new enum for every incidental string or duplicate a generated/public contract.
- Reused domain route paths and parameter construction have one named owner. Components import route builders; router execution remains with the app. Preserve URL encoding, supported filters, pagination reset and host/embedded navigation.

## Types and boundary data

- Do not use `any`. Prefer `unknown` for untrusted or genuinely unknown values, then narrow it with a type guard, schema, or explicit validation.
- An unavoidable `any` needs a narrow scope and an explanatory comment with a removal condition. Do not use it to bypass a compiler error.
- Use `interface` for named, object-shaped public models intended to be extended or implemented.
- Use `type` for unions, intersections, mapped/conditional types, tuples, primitives, and type composition.
- Use `import type` for type-only imports.
- Define public API/event/contract types at the owning boundary, not inline inside a consuming component. Prefer generated/shared contracts when available. Separate query/path parameters, request bodies, responses and schema-inferred form values with meaningful names. Reuse `Pick`, `Omit`, indexed access and `Partial` where the underlying contract is identical; do not duplicate fields or derive writable payloads from an entire response (server IDs, relations, aggregates and nullability differ). `Partial` is appropriate for PATCH only when the endpoint supports it. Map form values to the request explicitly when representations differ.
- Avoid type assertions (`as`) at trust boundaries. Validate first; assertions are acceptable only when TypeScript cannot infer a fact already guaranteed by local code.

## Functions and components

- Keep functions focused. Prefer early returns over deeply nested conditionals.
- Prefer a named options object for related function inputs, optional settings or an API expected to grow. Keep the installed SDK signature inside its adapter; do not reproduce positional argument lists across callers. Small single-value utilities do not need an artificial wrapper object.
- In TypeScript, use named types for object-shaped function parameters, options, callbacks and component props; do not declare their object structure inside a function signature or repeat it at call sites. Let ordinary local values and contextually typed callback parameters use inference.
- Keep related types in a descriptive `<responsibility>.types.ts` beside their owning module or feature. Reuse an existing owner type with `Pick`, `Omit`, indexed access or extension when the meaning matches. Promote a type to a shared package only when the shared boundary owns it; do not create an application-wide dumping ground for unrelated types.
- Keep transport options in the integration package, wire payloads in the contract owner, framework props in the UI adapter and domain inputs in the feature. Export reusable types through the owner's public API and use `import type`; preserve existing exports when extracting types.
- Write code comments as a single concise English line explaining intent, a constraint or a non-obvious reason. Do not narrate obvious syntax or put a multi-step workflow in a source comment; use the maintained guide for longer explanations.
- A UI component should own rendering and local interaction; move reusable stateful behavior into a hook and domain/API work into the established service/query layer.
- Avoid barrel files that create circular dependencies or hide ownership. Export a public surface intentionally.
