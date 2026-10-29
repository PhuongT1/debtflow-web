# Debtflow Structure

**Activate:** structure changes in Debtflow; load only this selected local extension.

Local references: [Parties toolbar](../../../../apps/partner-ops/src/features/parties/list/toolbar.tsx), [row columns](../../../../apps/partner-ops/src/features/parties/list/columns.tsx), [Shell adapters](../../../../apps/shell/src/services/debt.client.ts).

## Debtflow placement decisions

| Requested change                           | Owner / starting point                                                                                      | Do not create                                                |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Add a Parties filter                       | `features/parties/list/toolbar.tsx`; filters in `model/party-filters.ts`; schema in `list/filter.schema.ts` | Filter behavior inside the generic `DataTable`               |
| Change a Party row action                  | `features/parties/list/columns.tsx`                                                                         | A business-specific branch in shared table cells             |
| Add a Shell debt endpoint                  | Existing `services/debt.client.ts` or `services/debt.server.ts`                                             | Another HTTP client or a second adapter for the same request |
| Add a partner-summary URL action           | `features/debts/partner-summary/use-params.ts`                                                              | A window-history helper inside a visual filter control       |
| Reuse confirmation UI in both React apps   | `packages/ui/react`; app passes labels and async action                                                     | Imports from the Shell auth feature into Partner Ops         |
| Reuse logout behavior in React and Angular | `packages/platform/sdk/src/auth/sign-out.ts`                                                                | A React hook in the framework-neutral SDK                    |

## Component families and feature subfolders

- In both React apps, UI forms use `components/ui/form/`, dialogs use `components/ui/dialog/`, page composition uses `components/ui/page/`, and table adapters/controls use `components/tables/`. Keep independent primitives such as button, badge, icon, skeleton and clamped text at `ui/`; do not add one directory per tiny component.
- In `packages/ui/react`, composed DataTable modules live under `components/table/data-table/`, lower-level table primitives remain in `components/table/`, and pagination/authentication presentation use `components/pagination/` and `components/auth/`. Import the stable package public API, never these internal paths from an app.
- Feature-specific form/query/column logic stays inside the owning feature. Group a growing operation such as `features/debts/forms/debt/`; keep a small cohesive feature flat. Put substantial login UI in `features/auth/login/`, not the framework route directory.
- Route modules adapt public feature entries. Required Next.js layout/error/loading names and cohesive primitive families are deliberate exceptions to one component per file, not permission to put unrelated features together.
- Before moving or renaming a file, locate all imports/exports, then update source links and tests. The dated [full component inventory](../../../../docs/engineering/component-structure-audit.md) records every TSX module audited across packages, Partner Ops and Shell.
