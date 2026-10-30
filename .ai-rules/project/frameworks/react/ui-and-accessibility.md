# Debtflow Ui And Accessibility

**Activate:** ui and accessibility changes in Debtflow; load only this selected local extension.

Local references: [Page layout](../../../../apps/shell/src/components/ui/page/page.tsx), [table container](../../../../packages/ui/react/src/components/table/table-container.tsx), [confirmation](../../../../packages/ui/react/src/components/auth/sign-out-dialog.tsx), [type tokens](../../../../packages/ui/tokens/src/index.ts).

## Reuse the existing surface

| Need                                 | Existing primitive / contract                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Screen heading, actions, breadcrumbs | App-local `Page` / `PageHeader`; layout owns the `main` landmark                                         |
| Scrollable/fixed-column table        | Public `DataTable` or `DataTableContent` from `@packages/ui-react`; app adapters own URL/i18n/navigation |
| Domain row configuration             | Feature-owned columns; generic table receives columns/rows and does not know debt/payment endpoints      |
| Shared confirmation                  | Public `SignOutDialog`: translated labels + rejecting async `onConfirm`; app supplies the action         |
| Global type/color roles              | `@packages/ui-tokens` and common MUI theme; Angular uses matching CSS tokens                             |
| React language dropdown              | Public `AppLocaleMenu`; caller persists the locale through the SDK                                       |

## Shared UI conventions

- Reuse `AppButton`, `AppInput`, `AppSelect`, `AppDatePicker` and `FilterToolbar` from `@packages/ui-react`; app adapters supply translations/navigation rather than duplicating control styles. Preserve supported props, refs and slot callbacks through the [wrapper contract](../../../core/frameworks/react/ui-and-accessibility/wrappers.md).
- Canonical color roles live in [token sources](../../../../packages/ui/tokens/src/index.ts): `palette/`, `schemes/` and `effects/`. The React [theme](../../../../packages/ui/react/src/providers/app-theme.ts) maps them into MUI; Angular consumes the generated CSS. Edit sources and regenerate CSS instead of hand-editing generated colors. See [token maintenance](../../../../packages/ui/tokens/README.md).
- Use surface/text/border/elevation roles in both modes. Primary solid actions use the paired contrast text; primary text uses its separate readable role. Radius roles are small 6px, controls 8px and cards/floating surfaces 12px; preserve correct MUI `sx` units.
- `DataTable` / `DataTableContent` support `small`, `medium` (default) and `large`, with nominal minimum row heights of 48/56/64px. Parties selects `small`; long content may grow. Reuse the same size in registry loading metadata and skeletons; do not restore page-specific fixed heights.
- Use shared `AppIcon` and `AppIconBadge`; picker icons follow the same outline family. The badge owns its semantic tint/foreground pairing. Select/menu backdrops remain transparent; visible modal backdrops are scoped by the MUI theme, not patched per page.

Implementation details and examples: [shared UI guide](../../../../packages/ui/react/README.md). Apply the reusable [styling rules](../../../core/frameworks/react/ui-and-accessibility/styling.md) and [verification](../../../core/frameworks/react/verification.md) only to affected responsibilities.
