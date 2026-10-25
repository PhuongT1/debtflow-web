'use client';

import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Box, LinearProgress, MenuItem, Paper, Typography } from '@mui/material';
import { AppPagination } from '@debtflow/react-ui';
import { useTranslations } from 'next-intl';
import { AppIcon } from '@/components/ui/app-icon';
import { TableLayout, TablePaginationBar } from '@debtflow/react-ui';
import { Button } from '@/components/ui/button';
import { AppSelect } from '@/components/ui/select';
import { listPartyDebtSummaries } from '@/services/party.client';
import { PartnerSummaryFilters } from './filters';
import { PartnerSummaryTable } from './table';
import type { PartnerSummaryPage } from './types';
import { usePartnerSummaryParams } from './use-params';

type Props = {
  users: Array<{ id: string; name: string; email: string }>;
};

export function PartnerSummary({ users }: Props) {
  const t = useTranslations('Debts');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const url = usePartnerSummaryParams();
  const { data: summary, isFetching } = useQuery({
    queryKey: ['partner-summary', url.params],
    queryFn: ({ signal }) => listPartyDebtSummaries<PartnerSummaryPage>(url.params, signal),
    placeholderData: keepPreviousData,
  });
  const first = summary?.total ? (summary.page - 1) * summary.pageSize + 1 : 0;
  const last = summary ? Math.min(summary.page * summary.pageSize, summary.total) : 0;

  useEffect(() => {
    if (!isFocusMode) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsFocusMode(false);
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isFocusMode]);

  return (
    <Paper
      elevation={0}
      sx={[
        {
          bgcolor: 'transparent',
          display: 'flex',
          flex: { xs: '0 0 auto', md: '1 1 0' },
          flexDirection: 'column',
          minHeight: { md: 0 },
        },
        isFocusMode && {
          bgcolor: 'background.default',
          height: '100dvh',
          inset: 0,
          maxWidth: 'none',
          px: { xs: 1.5, md: 3 },
          position: 'fixed',
          width: '100vw',
          zIndex: (theme) => theme.zIndex.modal,
        },
      ]}
    >
      <Box
        sx={{
          flexShrink: 0,
          px: 0,
          py: 2,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{t('partnerDebtTitle')}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              {t('recordCount', { count: summary?.total ?? 0 })}
            </Typography>
          </Box>
          <Button
            aria-label={isFocusMode ? t('exitTableFocus') : t('focusTable')}
            onClick={() => setIsFocusMode((current) => !current)}
            size="small"
            startIcon={<AppIcon name={isFocusMode ? 'fullscreenExit' : 'fullscreen'} />}
            variant="secondary"
          >
            {isFocusMode ? t('exitTableFocus') : t('focusTable')}
          </Button>
        </Box>
        <PartnerSummaryFilters
          applyFilters={url.applyFilters}
          clearFilters={url.clearFilters}
          params={url.params}
        />
      </Box>

      {isFetching ? (
        <LinearProgress aria-label={t('loadingDebtData')} sx={{ flexShrink: 0 }} />
      ) : null}

      <TableLayout
        fillAvailable
        sx={{ my: isFocusMode ? 0 : 2.5 }}
        footer={
          <TablePaginationBar
            summary={
              <Typography variant="body2">
                {t('displayedRows', { first, last, total: summary?.total ?? 0 })}
              </Typography>
            }
          >
            <Typography color="text.secondary" variant="body2">
              {t('rowsPerPage')}
            </Typography>
            <AppSelect
              aria-label={t('rowsPerPage')}
              disabled={isFetching}
              onChange={(event) => url.changePageSize(Number(event.target.value))}
              sx={{ minWidth: 92, width: 92 }}
              value={summary?.pageSize ?? url.params.pageSize}
            >
              {[5, 10, 20, 30, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </AppSelect>
            <AppPagination
              disabled={isFetching}
              onPageChange={url.changePage}
              page={summary?.page ?? url.params.page}
              pageSize={summary?.pageSize ?? url.params.pageSize}
              total={summary?.total ?? 0}
            />
          </TablePaginationBar>
        }
      >
        <PartnerSummaryTable
          changeSort={url.changeSort}
          isFetching={isFetching}
          params={url.params}
          summary={summary}
          users={users}
        />
      </TableLayout>
    </Paper>
  );
}
