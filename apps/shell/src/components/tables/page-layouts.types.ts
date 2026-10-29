import type { DataTableSkeletonColumn } from '@packages/ui-react';

export type TablePageKind = 'debts' | 'overdue' | 'aging' | 'users' | 'payments';
export interface TablePageSkeletonProps {
  kind?: TablePageKind;
  label?: string;
}
export interface TablePageLayout {
  columns: DataTableSkeletonColumn[];
  actions: number;
  filters?: boolean;
  metrics?: boolean;
}
