'use client';

import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import {
  AppPaginationLinks,
  DataTablePagination as SharedTablePagination,
} from '@packages/ui-react';

import { PageSizeSelect } from '@/components/tables/page-size-select';

import type { DataTablePaginationProps } from './data-table-pagination.types';

export function DataTablePagination({
  page,
  pageSize,
  total,
  hrefByPage,
  pageSizeOptions,
  loading = false,
}: DataTablePaginationProps) {
  const ui = useTranslations('Workspace');

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(total, safePage * pageSize);
  return (
    <SharedTablePagination
      loading={loading}
      summary={
        <Typography color="text.secondary" variant="body2">
          {ui('show')} {from}-{to} / {total} {ui('rows')}
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
