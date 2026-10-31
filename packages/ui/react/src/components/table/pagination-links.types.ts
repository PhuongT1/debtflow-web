export type CreateTablePaginationLinksProps = {
  page: number;
  pageSize: number;
  total: number;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
};
