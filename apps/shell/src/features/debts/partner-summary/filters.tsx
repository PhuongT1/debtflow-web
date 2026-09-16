import { useState } from 'react';
import { Box, MenuItem, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { PartnerSummaryParams } from '@/services/party.client';
import type { PartnerSummaryFilters } from './params';

type Props = {
  applyFilters: (filters: PartnerSummaryFilters) => void;
  clearFilters: () => void;
  params: PartnerSummaryParams;
};

export function PartnerSummaryFilters({ applyFilters, clearFilters, params }: Props) {
  const t = useTranslations('Debts');
  const [filters, setFilters] = useState<PartnerSummaryFilters>({
    q: params.q ?? '',
    type: params.type ?? '',
    balanceType: params.balanceType ?? '',
  });

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.25,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'minmax(220px, 2fr) repeat(2, minmax(160px, 1fr)) auto auto',
        },
        mt: 2,
      }}
    >
      <TextField
        aria-label={t('searchPartners')}
        onChange={(event) => setFilters((current) => ({ ...current, q: event.target.value }))}
        onKeyDown={(event) => {
          if (event.key === 'Enter') applyFilters(filters);
        }}
        placeholder={t('searchPartnersPlaceholder')}
        size="small"
        value={filters.q}
      />
      <TextField
        onChange={(event) =>
          setFilters((current) => ({
            ...current,
            type: event.target.value as typeof current.type,
          }))
        }
        select
        size="small"
        value={filters.type}
      >
        <MenuItem value="">{t('allPartnerTypes')}</MenuItem>
        <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
        <MenuItem value="SUPPLIER">Nhà cung cấp</MenuItem>
        <MenuItem value="BOTH">Cả hai</MenuItem>
      </TextField>
      <TextField
        onChange={(event) =>
          setFilters((current) => ({
            ...current,
            balanceType: event.target.value as typeof current.balanceType,
          }))
        }
        select
        size="small"
        value={filters.balanceType}
      >
        <MenuItem value="">{t('allBalances')}</MenuItem>
        <MenuItem value="RECEIVABLE">Khách đang nợ bạn</MenuItem>
        <MenuItem value="PAYABLE">Bạn đang nợ nhà cung cấp</MenuItem>
      </TextField>
      <Button onClick={() => applyFilters(filters)} size="small">
        {t('filter')}
      </Button>
      <Button onClick={clearFilters} size="small" variant="secondary">
        {t('clearFilters')}
      </Button>
    </Box>
  );
}
