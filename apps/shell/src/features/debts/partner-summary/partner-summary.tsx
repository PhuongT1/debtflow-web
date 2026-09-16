'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  Box,
  FormControl,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material';
import { AppPagination } from '@debtflow/react-ui';
import { useTranslations } from 'next-intl';
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
  const url = usePartnerSummaryParams();
  const { data: summary, isFetching } = useQuery({
    queryKey: ['partner-summary', url.params],
    queryFn: ({ signal }) => listPartyDebtSummaries<PartnerSummaryPage>(url.params, signal),
    placeholderData: keepPreviousData,
  });
  const first = summary?.total ? (summary.page - 1) * summary.pageSize + 1 : 0;
  const last = summary ? Math.min(summary.page * summary.pageSize, summary.total) : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        display: 'flex',
        flex: { xs: '0 0 auto', md: '1 1 0' },
        flexDirection: 'column',
        minHeight: { md: 0 },
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
          px: 2.5,
          py: 2,
        }}
      >
        <Box
          sx={{
            alignItems: 'baseline',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.25,
          }}
        >
          <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{t('partnerDebtTitle')}</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>
            {t('recordCount', { count: summary?.total ?? 0 })}
          </Typography>
        </Box>
        <PartnerSummaryFilters
          applyFilters={url.applyFilters}
          clearFilters={url.clearFilters}
          key={`${url.params.q ?? ''}:${url.params.type ?? ''}:${url.params.balanceType ?? ''}`}
          params={url.params}
        />
      </Box>

      {isFetching ? (
        <LinearProgress aria-label={t('loadingDebtData')} sx={{ flexShrink: 0 }} />
      ) : null}

      <PartnerSummaryTable
        changeSort={url.changeSort}
        isFetching={isFetching}
        params={url.params}
        summary={summary}
        users={users}
      />

      <Box
        sx={{
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'space-between',
          minHeight: 58,
          px: 2.5,
          py: 1,
        }}
      >
        <Typography variant="body2">
          {t('displayedRows', { first, last, total: summary?.total ?? 0 })}
        </Typography>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexShrink: 0,
            gap: 1.5,
          }}
        >
          <Typography color="text.secondary" variant="body2">
            {t('rowsPerPage')}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 92 }}>
            <Select
              aria-label={t('rowsPerPage')}
              disabled={isFetching}
              onChange={(event) => url.changePageSize(Number(event.target.value))}
              value={summary?.pageSize ?? url.params.pageSize}
            >
              {[5, 10, 20, 30, 50, 100].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <AppPagination
            disabled={isFetching}
            onPageChange={url.changePage}
            page={summary?.page ?? url.params.page}
            pageSize={summary?.pageSize ?? url.params.pageSize}
            total={summary?.total ?? 0}
          />
        </Box>
      </Box>
    </Paper>
  );
}
