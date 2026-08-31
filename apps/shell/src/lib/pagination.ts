export function hrefWithPage(pathname: string, params: Record<string, string | undefined>, page: number) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page") search.set(key, value);
  });

  if (page > 1) search.set("page", String(page));

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function hrefWithPageSize(pathname: string, params: Record<string, string | undefined>, pageSize: number) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== "page" && key !== "pageSize") search.set(key, value);
  });

  search.set("pageSize", String(pageSize));

  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}
