# Debtflow Contracts

**Activate:** contracts changes in Debtflow; load only this selected local extension.

Local references: [Parties screen](../../../../../apps/partner-ops/src/features/parties/list/party-list.tsx), [domain table](../../../../../apps/shell/src/features/debts/partner-summary/documents/table.tsx), [shared dialog](../../../../../packages/ui/react/src/components/auth/sign-out-dialog.tsx), [auth composition](../../../../../apps/shell/src/features/auth/authenticated-shell.tsx). Reuse the stated responsibility, not every historical detail of the file.

## Partner Ops table adapter

`DataTable` consumes wrapper-specific/transformed props, defaults `rowKey` to `id` for its identified-row contract, and forwards unchanged supported props (`title`, `toolbar`, `skeletonRowCount`) through `...rest` to the shared table. Keep invariant overrides after the spread. The shared renderer owns the default skeleton row count (8); page size does not imply a custom skeleton clamp. API metadata is consumed by table adapters, never spread onto DOM elements.
