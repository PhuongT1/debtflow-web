# React Rules

- Use function components and hooks.
- Keep effects for synchronization with an external system; do not use `useEffect` to derive local render state.
- Keep client state local by default. Extract a custom hook only when stateful behavior is genuinely reusable.
- Prefer composition and existing `@debtflow/react-ui` components over duplicated layout primitives.
- Give lists stable keys and make loading, empty, and error states explicit.
- Keep public component props small and typed; do not expose framework implementation details through cross-app contracts.

## Imports

- In a React app, use only aliases configured by that app for imports that cross a feature or source-root boundary.
- Keep relative imports for siblings and tightly colocated component parts. Do not replace every local `./` import with an alias.
- When a feature has an intentional public API, consumers outside it import from that feature index; files inside the feature import direct local modules.

## File naming

- Use kebab-case `.tsx` file names for React components: `partner-table.tsx`, `account-menu.tsx`.
- Do not use Angular-style component suffixes such as `*.component.ts` or `*.component.tsx` in React code.
- Name reusable hooks `use-<domain>.ts` and export a matching `useDomain` hook: `use-party-filters.ts` / `usePartyFilters`.
