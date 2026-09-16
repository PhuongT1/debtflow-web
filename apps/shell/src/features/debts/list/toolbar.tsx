'use client';

import { useState } from 'react';
import { MenuItem, Box, Button as MuiButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { FilterActions } from '@/components/ui/filter-actions';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';
import { CollectionStatus, DebtStatus } from '@/lib/domain/enums';
import type { CatalogOptions } from '@/features/catalog/catalog.types';

type DebtListToolbarProps = {
  activeUsers: Array<{ id: string; name: string }>;
  filters: Record<string, string | undefined>;
  catalog: CatalogOptions;
};

export function DebtListToolbar({ activeUsers, catalog, filters }: DebtListToolbarProps) {
  const t = useTranslations('Debts');
  const [showDetails, setShowDetails] = useState(false);
  const collectionLabels: Record<CollectionStatus, string> = {
    NEW: t('new'),
    CONTACTED: t('contacted'),
    PROMISED: t('promised'),
    DISPUTED: t('disputed'),
    ESCALATED: t('escalated'),
  };
  const statusLabels: Record<DebtStatus, string> = {
    OPEN: t('open'),
    PARTIAL: t('partial'),
    PAID: t('paid'),
    CANCELLED: t('cancelled'),
  };

  return (
    <DataTableToolbar
      columns={{ xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }}
    >
      <AppInput
        defaultValue={filters.q ?? ''}
        label={t('search')}
        name="q"
        placeholder={t('searchPlaceholder')}
      />
      <AppSelect defaultValue={filters.type ?? ''} label={t('type')} name="type">
        <MenuItem value="">{t('all')}</MenuItem>
        <MenuItem value="RECEIVABLE">{t('receivable')}</MenuItem>
        <MenuItem value="PAYABLE">{t('payable')}</MenuItem>
      </AppSelect>
      <AppSelect
        defaultValue={filters.outstanding ?? ''}
        label={t('settlement')}
        name="outstanding"
      >
        <MenuItem value="">{t('all')}</MenuItem>
        <MenuItem value="true">{t('unsettled')}</MenuItem>
        <MenuItem value="false">{t('settled')}</MenuItem>
      </AppSelect>
      <AppSelect defaultValue={filters.dueRange ?? ''} label={t('dueDate')} name="dueRange">
        <MenuItem value="">{t('all')}</MenuItem>
        <MenuItem value="today">{t('today')}</MenuItem>
        <MenuItem value="tomorrow">{t('tomorrow')}</MenuItem>
        <MenuItem value="next_7_days">{t('next7Days')}</MenuItem>
        <MenuItem value="this_month">{t('thisMonth')}</MenuItem>
      </AppSelect>
      <AppSelect defaultValue={filters.categoryId ?? ''} label={t('category')} name="categoryId">
        <MenuItem value="">{t('all')}</MenuItem>
        {catalog.categories.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </AppSelect>
      <Box sx={{ alignSelf: 'end', display: 'flex', gap: 1, gridColumn: { lg: 'span 2' } }}>
        <MuiButton
          onClick={() => setShowDetails((value) => !value)}
          size="small"
          type="button"
          variant="text"
        >
          {showDetails ? t('hideAdvancedFilters') : t('advancedFilters')}
        </MuiButton>
      </Box>
      <FilterActions resetHref="/debts" />
      {showDetails ? (
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridColumn: '1 / -1',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
              lg: 'repeat(4, minmax(0, 1fr))',
            },
            pt: 0.5,
          }}
        >
          <AppSelect
            defaultValue={filters.salesChannel ?? ''}
            label={t('channel')}
            name="salesChannel"
          >
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="STORE">{t('store')}</MenuItem>
            <MenuItem value="ONLINE">{t('online')}</MenuItem>
            <MenuItem value="WHOLESALE">{t('wholesale')}</MenuItem>
          </AppSelect>
          <AppSelect defaultValue={filters.brandId ?? ''} label={t('brand')} name="brandId">
            <MenuItem value="">{t('all')}</MenuItem>
            {catalog.brands.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </AppSelect>
          <AppSelect defaultValue={filters.productId ?? ''} label={t('product')} name="productId">
            <MenuItem value="">{t('all')}</MenuItem>
            {catalog.products.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </AppSelect>
          <AppSelect
            defaultValue={filters.provinceCode ?? ''}
            label={t('province')}
            name="provinceCode"
          >
            <MenuItem value="">{t('all')}</MenuItem>
            {catalog.provinces.map((item) => (
              <MenuItem key={item.provinceCode} value={item.provinceCode}>
                {item.provinceName ?? item.provinceCode}
              </MenuItem>
            ))}
          </AppSelect>
          <AppSelect defaultValue={filters.status ?? ''} label={t('status')} name="status">
            <MenuItem value="">{t('all')}</MenuItem>
            {Object.values(DebtStatus).map((item) => (
              <MenuItem key={item} value={item}>
                {statusLabels[item]}
              </MenuItem>
            ))}
          </AppSelect>
          <AppSelect
            defaultValue={filters.collectionStatus ?? ''}
            label={t('collection')}
            name="collectionStatus"
          >
            <MenuItem value="">{t('all')}</MenuItem>
            {Object.values(CollectionStatus).map((item) => (
              <MenuItem key={item} value={item}>
                {collectionLabels[item]}
              </MenuItem>
            ))}
          </AppSelect>
          <AppSelect
            defaultValue={filters.assignedToId ?? ''}
            label={t('owner')}
            name="assignedToId"
          >
            <MenuItem value="">{t('all')}</MenuItem>
            {activeUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </AppSelect>
          <AppSelect defaultValue={filters.aging ?? ''} label={t('aging')} name="aging">
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="not_due">{t('notDue')}</MenuItem>
            <MenuItem value="1_7">{t('aging1to7')}</MenuItem>
            <MenuItem value="8_30">{t('aging8to30')}</MenuItem>
            <MenuItem value="31_60">{t('aging31to60')}</MenuItem>
            <MenuItem value="60_plus">{t('aging60Plus')}</MenuItem>
          </AppSelect>
          <AppSelect defaultValue={filters.followUp ?? ''} label={t('followUp')} name="followUp">
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="overdue">{t('overdueFollowUp')}</MenuItem>
            <MenuItem value="today">{t('today')}</MenuItem>
            <MenuItem value="upcoming">{t('upcoming')}</MenuItem>
          </AppSelect>
        </Box>
      ) : null}
    </DataTableToolbar>
  );
}
