# Code Structure, Naming, and TypeScript Rules

## File and module size

- Keep a source file at **230 lines or fewer** by default, excluding generated files, declaration files, and framework-required configuration.
- Split by responsibility, not arbitrarily: extract a cohesive component, hook, service, formatter, schema, or mapper when it has its own reason to change.
- A file may exceed 230 lines only when splitting would make the code less cohesive or harder to follow. Add a short module-level comment explaining the exception and the intended boundary, for example:

  ```ts
  // Intentionally over 230 lines: this form and its validation state must evolve together.
  ```

- Do not split a file merely to satisfy the number if the resulting files create circular imports, prop drilling, or fragmented business flow.

## Names and paths

- Use **kebab-case** for ordinary directories and file names: `partner-ops`, `payment-history.ts`, `use-party-filters.ts`.
- Framework-specific file naming belongs in the relevant framework and application rule. Do not apply Angular suffix conventions to React/Next files.
- Use PascalCase for React component exports, Angular classes, types, interfaces, and enums: `PartnerTable`, `PaymentApiService`, `PartyFilter`.
- Use camelCase for functions, variables, object properties, hooks, and event handlers: `getPartyById`, `partyId`, `usePartyFilters`, `handleSave`.
- Use UPPER_SNAKE_CASE only for true module-level constants that never change: `DEFAULT_PAGE_SIZE`, `MAX_RETRY_COUNT`. Do not use it for ordinary local values.
- Name boolean values as questions or states: `isLoading`, `hasPermission`, `canDelete`.
- Name collections in plural and single values in singular: `parties` / `party`.
- Prefer domain words over generic names. Avoid `data`, `item`, `utils`, `helpers`, `manager`, or `common` unless the scope makes the meaning unambiguous.

## Imports and module public APIs

- Use the configured alias when crossing an application, feature, or package boundary. Do not use `../../` or deeper parent-relative imports in application source.
- Use `./` for a sibling or child module. One `../` is allowed only within the same cohesive feature folder when it is clearer than an alias.
- Each deployable app owns its aliases. Do not copy an alias convention from a different app; configure TypeScript and the framework/bundler together before using it.
- Import shared code through the package public export, for example `@debtflow/contracts`; never reach into another package or app `src/` directory.
- A feature or package may expose an `index.ts` only as its intentional public API for consumers outside that boundary. Use explicit named re-exports; do not add a barrel merely to shorten a local import.
- Keep internal implementation imports direct. An index must not re-export private helpers, framework route files, or every file in a directory. Avoid `export *` in public indexes unless the exports are a deliberately versioned contract.
- Before adding an index, check for circular dependencies. Public indexes must not be imported by modules that they re-export.

## Types and boundary data

- Do not use `any`. Prefer `unknown` for untrusted or genuinely unknown values, then narrow it with a type guard, schema, or explicit validation.
- An unavoidable `any` needs a narrow scope and an explanatory comment with a removal condition. Do not use it to bypass a compiler error.
- Use `interface` for named, object-shaped public models intended to be extended or implemented.
- Use `type` for unions, intersections, mapped/conditional types, tuples, primitives, and type composition.
- Use `import type` for type-only imports.
- Define public API/event/contract types at the package boundary, not inline inside a consuming component.
- Avoid type assertions (`as`) at trust boundaries. Validate first; assertions are acceptable only when TypeScript cannot infer a fact already guaranteed by local code.

## Functions and components

- Keep functions focused. Prefer early returns over deeply nested conditionals.
- A UI component should own rendering and local interaction; move reusable stateful behavior into a hook and domain/API work into the established service/query layer.
- Avoid barrel files that create circular dependencies or hide ownership. Export a public surface intentionally.
