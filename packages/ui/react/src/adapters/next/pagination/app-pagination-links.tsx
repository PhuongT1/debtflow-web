'use client';
import type { AppPaginationLinksProps } from '../next.types';

import { useRouter } from 'next/navigation';
import { AppPagination } from '../../../components/pagination/app-pagination';

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

export type { AppPaginationLinksProps } from '../next.types';
