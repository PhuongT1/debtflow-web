import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DebouncedSearchInput } from '@/components/ui/debounced-search-input';
import { Select } from '@/components/ui/select';
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

  // URL changes can come from pagination, browser navigation, or the clear action.
  // Synchronise values without remounting the search input, so its focus is retained.
  useEffect(() => {
    setFilters({
      q: params.q ?? '',
      type: params.type ?? '',
      balanceType: params.balanceType ?? '',
    });
  }, [params.balanceType, params.q, params.type]);

  return (
    <Box
      sx={{
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1.25,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'minmax(220px, 2fr) repeat(2, minmax(160px, 1fr)) auto auto',
          },
        }}
      >
        <DebouncedSearchInput
          onSearch={(q) => {
            const next = { ...filters, q };
            setFilters(next);
            applyFilters(next);
          }}
          placeholder={t('searchPartnersPlaceholder')}
          value={filters.q}
        />
        <Select
          allowClear
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              type: value as typeof current.type,
            }))
          }
          options={[
            { label: 'Khách hàng', value: 'CUSTOMER' },
            { label: 'Nhà cung cấp', value: 'SUPPLIER' },
            { label: 'Cả hai', value: 'BOTH' },
          ]}
          placeholder={t('allPartnerTypes')}
          value={filters.type ?? ''}
        />
        <Select
          allowClear
          onChange={(value) =>
            setFilters((current) => ({
              ...current,
              balanceType: value as typeof current.balanceType,
            }))
          }
          options={[
            { label: 'Khách đang nợ bạn', value: 'RECEIVABLE' },
            { label: 'Bạn đang nợ nhà cung cấp', value: 'PAYABLE' },
          ]}
          placeholder={t('allBalances')}
          value={filters.balanceType ?? ''}
        />
        <Button onClick={() => applyFilters(filters)} size="small">
          {t('filter')}
        </Button>
        <Button
          onClick={() => {
            setFilters({ balanceType: '', q: '', type: '' });
            clearFilters();
          }}
          size="small"
          variant="secondary"
        >
          {t('clearFilters')}
        </Button>
      </Box>
    </Box>
  );
}
