export function createTablePaginationLinks({
  page,
  pageSize,
  total,
  hrefForPage,
  hrefForPageSize,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const pages = [
    ...new Set([1, totalPages, safePage - 2, safePage - 1, safePage, safePage + 1, safePage + 2]),
  ].filter((candidate) => candidate >= 1 && candidate <= totalPages);
  return {
    hrefByPage: Object.fromEntries(pages.map((candidate) => [candidate, hrefForPage(candidate)])),
    pageSizeOptions: hrefForPageSize
      ? [10, 20, 30, 50, 100].map((size) => ({ size, href: hrefForPageSize(size) }))
      : [],
  };
}
