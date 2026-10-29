import type { PaginationMeta } from '@packages/platform-contracts';
import type { DataTableSkeletonSpec, FixedTableSide, DataTableSize } from '@packages/ui-react';
export type { DataTableSkeletonSpec } from '@packages/ui-react';

export type DataTableColumn<Row> = {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  sticky?: boolean;
  fixed?: FixedTableSide;
  width?: number | string;
  skeleton?: DataTableSkeletonSpec;
  render: (row: Row) => React.ReactNode;
};

export type DataTableProps<Row extends { id: React.Key }> = Pick<
  PaginationMeta,
  'page' | 'pageSize' | 'total'
> & {
  title?: string;
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  size?: DataTableSize;
  fillHeight?: boolean;
  loading?: boolean;
  skeletonRowCount?: number;
  skeletonRowHeight?: number;
  pagination?: boolean;
  rowKey?: keyof Row | ((row: Row, index: number) => React.Key);
  toolbar?: React.ReactNode;
};
