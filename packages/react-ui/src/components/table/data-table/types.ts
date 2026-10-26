import type { Key, ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';
import type { FixedTableSide, TableScroll } from '../types';

export interface DataTableSkeletonSpec {
  direction?: 'row' | 'column';
  items: Array<{ height?: number; variant?: 'circular' | 'rounded'; width: number | string }>;
}

export interface DataTableColumn<Row> {
  key: string;
  title: ReactNode;
  align?: 'left' | 'right' | 'center';
  fixed?: FixedTableSide;
  width?: number | string;
  sortKey?: string;
  skeleton?: DataTableSkeletonSpec;
  render: (row: Row) => ReactNode;
}

export interface DataTableContentProps<Row> {
  columns: Array<DataTableColumn<Row>>;
  dataSource: Row[];
  emptyMessage: ReactNode;
  emptyHint?: ReactNode;
  emptyIcon?: ReactNode;
  fillHeight?: boolean;
  loading?: boolean;
  loadingContent?: ReactNode;
  skeletonRowCount?: number;
  rowKey?: keyof Row | ((record: Row, index: number) => Key);
  scroll?: TableScroll;
  tableSx?: SxProps<Theme>;
  renderHeader?: (column: DataTableColumn<Row>) => ReactNode;
  summary?: (currentPageData: Row[]) => ReactNode;
}

export interface DataTableProps<Row> extends DataTableContentProps<Row> {
  title?: ReactNode;
  description?: ReactNode;
  toolbar?: ReactNode;
  footer?: ReactNode;
  pagination?: ReactNode;
}
