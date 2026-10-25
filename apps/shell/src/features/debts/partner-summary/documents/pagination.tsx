'use client';

import { Box, MenuItem, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppPagination } from '@/components/ui/app-pagination';
import { AppSelect } from '@/components/ui/select';
import { TablePaginationBar } from '@debtflow/react-ui';

export function DocumentPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  loading = false,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
}) {
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
        <AppSelect
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
        </AppSelect>
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
