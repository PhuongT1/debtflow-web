'use client';

import { useRouter } from 'next/navigation';
import { AppPagination } from './app-pagination';

export type AppPaginationLinksProps = {
  page: number;
  pageSize: number;
  total: number;
  hrefByPage: Record<number, string>;
};

/** URL-driven pagination. It receives only serializable href data across an RSC boundary. */
export function AppPaginationLinks({ page, pageSize, total, hrefByPage }: AppPaginationLinksProps) {
  const router = useRouter();
  return (
    <AppPagination
      page={page}
      pageSize={pageSize}
      total={total}
      onPageChange={(nextPage) => {
        const href = hrefByPage[nextPage];
        if (href) router.push(href, { scroll: false });
      }}
    />
  );
}
