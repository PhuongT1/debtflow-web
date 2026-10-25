# Naming

**Activate:** naming files, hooks, exports or public types. **Scope:** this responsibility only; apply project facts and the selected task workflow.

- Use the project's JSX language extension (`.tsx` for TypeScript, `.jsx` for JavaScript) and configured naming convention. Under the default kebab-case convention: `party-table.tsx`, `account-menu.tsx`.
- Component exports use PascalCase: `PartyTable`, `AccountMenu`. Prefer named function declarations for new exported components.
- Hook files use `use-<purpose>.ts` (or `.js` in a JavaScript project) and export the matching camelCase hook: `use-party-filters.ts` / `usePartyFilters`. Use `.tsx` only when the hook module actually contains JSX; prefer separating substantial returned UI.
- Pure functions use `.ts` (or `.js`) and a domain/purpose name: `party-formatters.ts`, `dashboard-period.ts`.
- Prefer names such as `PartyTableProps`, `PartyFilters`, `CreatePartyInput`, and `PartyResponse` over `Props`, `Data`, or `Result` when those types span a module boundary.
- Existing role suffixes such as `party-list.types.ts`, `debt.schema.ts`, and `.client.ts` / `.server.ts` remain valid. Keep adjacent naming consistent; do not mass-rename a feature for aesthetics.
- Do not introduce Angular-style `.component.tsx` filenames into React.
- New ordinary modules should use named exports. Framework-required default exports remain valid; keep existing public default exports compatible until deliberately migrated.
- Follow the source-file size limit and exception procedure in [code-style.md](../../../standards/code-style.md). Do not invent additional arbitrary component/function line limits.
