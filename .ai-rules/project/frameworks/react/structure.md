# Debtflow Structure

**Activate:** structure changes in Debtflow; load only this selected local extension.

Local references: [Parties toolbar](../../../../apps/partner-ops/src/features/parties/party-list-toolbar.tsx), [row columns](../../../../apps/partner-ops/src/features/parties/party-list-columns.tsx), [Shell adapters](../../../../apps/shell/src/services/debt.client.ts).

## Debtflow placement decisions

| Requested change                           | Owner / starting point                                                             | Do not create                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Add a Parties filter                       | `features/parties/party-list-toolbar.tsx`; parsing/schema in `party-list.types.ts` | Filter behavior inside the generic `DataTable`               |
| Change a Party row action                  | `features/parties/party-list-columns.tsx`                                          | A business-specific branch in shared table cells             |
| Add a Shell debt endpoint                  | Existing `services/debt.client.ts` or `services/debt.server.ts`                    | Another HTTP client or a second adapter for the same request |
| Add a partner-summary URL action           | `features/debts/partner-summary/use-params.ts`                                     | A window-history helper inside a visual filter control       |
| Reuse confirmation UI in both React apps   | `packages/react-ui`; app passes labels and async action                            | Imports from the Shell auth feature into Partner Ops         |
| Reuse logout behavior in React and Angular | `packages/platform-sdk/src/auth/sign-out.ts`                                       | A React hook in the framework-neutral SDK                    |
