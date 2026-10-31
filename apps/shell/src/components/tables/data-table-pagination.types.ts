export type DataTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  hrefByPage: Record<number, string>;
  pageSizeOptions: Array<{ size: number; href: string }>;
  loading?: boolean;
};
