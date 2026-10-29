'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Box, Typography } from '@mui/material';
import { AppPagination, DataTablePagination as SharedTablePagination } from '@packages/ui-react';
import { PageSizeSelect } from '@/components/tables/page-size-select';
import { isEmbeddedInPlatform, navigateToPlatform } from '@/lib/platform-navigation';

export function DataTablePagination({
  page,
  pageSize,
  total,
  hrefByPage,
  pageSizeOptions,
  loading = false,
}: {
  page: number;
  pageSize: number;
  total: number;
  hrefByPage: Record<number, string>;
  pageSizeOptions: Array<{ size: number; href: string }>;
  loading?: boolean;
}) {
  const t = useTranslations('Pagination');
  const router = useRouter();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);
  return (
    <SharedTablePagination
      loading={loading}
      summary={
        <Typography color="text.secondary" variant="body2">
          {t('summary', { from, to, total })}
        </Typography>
      }
    >
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, flexShrink: 0 }}>
        <PageSizeSelect options={pageSizeOptions} pageSize={pageSize} />
      </Box>
      <AppPagination
        onPageChange={(nextPage) => {
          const href = hrefByPage[nextPage];
          if (!href) return;
          if (isEmbeddedInPlatform()) navigateToPlatform(href);
          else router.push(href, { scroll: false });
        }}
        page={page}
        pageSize={pageSize}
        total={total}
      />
    </SharedTablePagination>
  );
}
