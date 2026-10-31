'use client';

import { Box, MenuItem, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppPagination } from '@packages/ui-react';
import { TablePaginationBar } from '@packages/ui-react';

import { SelectField } from '@/components/ui/form/select';

import type { DocumentPaginationProps } from './pagination.types';

export function DocumentPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: DocumentPaginationProps) {
  const t = useTranslations('Debts');
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <TablePaginationBar
      summary={
        <Typography variant="body2">{t('paginationSummary', { from, to, total })}</Typography>
      }
    >
      <Box sx={{ alignItems: 'center', display: 'flex', flexShrink: 0, gap: 1 }}>
        <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="body2">
          {t('rowsPerPage')}
        </Typography>
        <SelectField
          disabled={loading}
          size="small"
          sx={{ minWidth: 92, width: 92 }}
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
        >
          {[10, 20, 30, 50, 100].map((size) => (
            <MenuItem key={size} value={String(size)}>
              {size}
            </MenuItem>
          ))}
        </SelectField>
        <AppPagination
          disabled={loading}
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={onPageChange}
        />
      </Box>
    </TablePaginationBar>
  );
}
