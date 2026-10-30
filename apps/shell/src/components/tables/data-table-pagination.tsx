'use client';

import { Box, Typography } from '@mui/material';

import {
  AppPaginationLinks,
  DataTablePagination as SharedTablePagination,
} from '@packages/ui-react';

import { PageSizeSelect } from '@/components/tables/page-size-select';

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
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);
  return (
    <SharedTablePagination
      loading={loading}
      summary={
        <Typography color="text.secondary" variant="body2">
          Hiển thị {from}-{to} / {total} dòng
        </Typography>
      }
    >
      <Box sx={{ alignItems: 'center', display: 'flex', gap: 1, flexShrink: 0 }}>
        <PageSizeSelect options={pageSizeOptions} pageSize={pageSize} />
      </Box>
      <AppPaginationLinks hrefByPage={hrefByPage} page={page} pageSize={pageSize} total={total} />
    </SharedTablePagination>
  );
}
