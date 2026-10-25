export type DataTableColumn<Row> = {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  sticky?: boolean;
  width?: number | string;
  skeleton?: DataTableSkeletonSpec;
  render: (row: Row) => React.ReactNode;
};

export type DataTableSkeletonSpec = {
  direction?: 'row' | 'column';
  items: Array<{
    height?: number;
    variant?: 'circular' | 'rounded';
    width: number | string;
  }>;
};

export type DataTableProps<Row> = {
  title?: string;
  columns: Array<DataTableColumn<Row>>;
  rows: Row[];
  emptyMessage?: string;
  page: number;
  pageSize: number;
  total: number;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  fillHeight?: boolean;
  loading?: boolean;
  pagination?: boolean;
  toolbar?: React.ReactNode;
};
