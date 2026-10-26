import type { PaginationMeta } from '@debtflow/contracts';
import type { DataTableSkeletonSpec, FixedTableSide } from '@debtflow/react-ui';
export type { DataTableSkeletonSpec } from '@debtflow/react-ui';

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
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  fillHeight?: boolean;
  loading?: boolean;
  skeletonRowCount?: number;
  pagination?: boolean;
  rowKey?: keyof Row | ((row: Row, index: number) => React.Key);
  toolbar?: React.ReactNode;
};
