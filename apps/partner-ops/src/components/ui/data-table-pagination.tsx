'use client';

import { useTranslations } from 'next-intl';
import { Box, Skeleton, Typography } from '@mui/material';
import { AppPaginationLinks } from '@debtflow/react-ui';
import { PageSizeSelect } from '@/components/ui/page-size-select';

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
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);
  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: 'background.default',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexShrink: 0,
        flexWrap: 'wrap',
        gap: 1,
        justifyContent: 'space-between',
        px: { xs: 1.5, sm: 2 },
        py: 1,
      }}
    >
      {loading ? (
        <>
          <Skeleton animation="wave" height={18} variant="rounded" width={150} />
          <Skeleton animation="wave" height={32} variant="rounded" width={220} />
        </>
      ) : (
        <>
          <Typography color="text.secondary" variant="body2">
            {t('summary', { from, to, total })}
          </Typography>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexShrink: 0,
              flexWrap: 'nowrap',
              gap: 1.5,
              overflowX: 'auto',
            }}
          >
            <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
              <PageSizeSelect options={pageSizeOptions} pageSize={pageSize} />
            </Box>
            <AppPaginationLinks
              hrefByPage={hrefByPage}
              page={page}
              pageSize={pageSize}
              total={total}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
