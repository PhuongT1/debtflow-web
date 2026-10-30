import type { DataTableColumn } from '@packages/ui-react';

import type { TablePageKind, TablePageLayout } from './page-layouts.types';

/** Route presentation only: no business requests or copied table renderer. */
export const tablePageLayouts: Record<TablePageKind, TablePageLayout> = {
  debts: {
    actions: 3,
    filters: true,
    columns: [
      { key: 'name', width: 300, fixed: 'left' },
      { key: 'outstandingDocuments', width: 180 },
      { key: 'receivable', width: 230, align: 'right' },
      { key: 'payable', width: 240, align: 'right' },
      { key: 'details', width: 130, align: 'right' },
      { key: 'actions', width: 180, fixed: 'right', align: 'right' },
    ],
  },
  overdue: {
    actions: 1,
    columns: ['code', 'party', 'type', 'remaining', 'dueDate', 'late', 'actions'].map(
      (key, index) => ({
        key,
        width: [150, 260, 110, 180, 150, 100, 120][index],
        align: key === 'remaining' ? 'right' : 'left',
      }),
    ),
  },
  aging: {
    actions: 1,
    metrics: true,
    columns: ['code', 'party', 'sale', 'remaining', 'dueDate', 'late', 'actions'].map(
      (key, index) => ({
        key,
        width: [150, 260, 160, 180, 120, 140, 120][index],
        align: key === 'remaining' ? 'right' : 'left',
      }),
    ),
  },
  users: {
    actions: 1,
    columns: ['name', 'email', 'role', 'status', 'actions'].map((key, index) => ({
      key,
      width: [240, 300, 180, 160, 150][index],
    })),
  },
  payments: {
    actions: 1,
    columns: ['date', 'debtCode', 'partner', 'amount', 'method', 'recordedBy', 'actions'].map(
      (key, index) => ({
        key,
        width: [100, 260, 220, 160, 130, 170, 100][index],
      }),
    ),
  },
};

/** Keep loading and loaded column geometry under one presentation owner. */
export function applyTableLayout<Row>(columns: DataTableColumn<Row>[], kind: TablePageKind) {
  return columns.map((column) => ({
    ...tablePageLayouts[kind].columns.find((item) => item.key === column.key),
    ...column,
  }));
}
