# Debtflow Ui And Accessibility

**Activate:** ui and accessibility changes in Debtflow; load only this selected local extension.

Local references: [Page layout](../../../../apps/shell/src/components/ui/page/page.tsx), [table container](../../../../packages/react-ui/src/components/table/table-container.tsx), [confirmation](../../../../packages/react-ui/src/components/auth/sign-out-dialog.tsx), [type tokens](../../../../packages/design-tokens/src/index.ts).

## Reuse the existing surface

| Need                                 | Existing primitive / contract                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Screen heading, actions, breadcrumbs | App-local `Page` / `PageHeader`; layout owns the `main` landmark                                         |
| Scrollable/fixed-column table        | Public `DataTable` or `DataTableContent` from `@debtflow/react-ui`; app adapters own URL/i18n/navigation |
| Domain row configuration             | Feature-owned columns; generic table receives columns/rows and does not know debt/payment endpoints      |
| Shared confirmation                  | Public `SignOutDialog`: translated labels + rejecting async `onConfirm`; app supplies the action         |
| Global type/color roles              | `@debtflow/design-tokens` and common MUI theme; Angular uses matching CSS tokens                         |
| React language dropdown              | Public `AppLocaleMenu`; caller persists the locale through the SDK                                       |
