'use client';

import { useState, type FormEvent } from 'react';
import { MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { FilterActions } from '@/components/ui/filter-actions';
import { AppDatePicker } from '@/components/ui/app-date-picker';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';

type Filters = {
  dueDateFrom: string;
  dueDateTo: string;
  q: string;
  status: string;
};

export function DocumentFilters({
  filters,
  onApply,
  onReset,
}: {
  filters: Filters;
  onApply: (filters: Filters) => void;
  onReset: () => void;
}) {
  const t = useTranslations('Debts');
  const [dueDateFrom, setDueDateFrom] = useState(filters.dueDateFrom);
  const [dueDateTo, setDueDateTo] = useState(filters.dueDateTo);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onApply({
      q: String(data.get('q') ?? '').trim(),
      status: String(data.get('status') ?? ''),
      dueDateFrom,
      dueDateTo,
    });
  };

  return (
    <DataTableToolbar
      columns={{ xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }}
      onSubmit={submit}
    >
      <AppInput
        defaultValue={filters.q}
        label={t('search')}
        name="q"
        placeholder={t('partnerDebtSearchPlaceholder')}
      />
      <AppSelect defaultValue={filters.status} label={t('status')} name="status">
        <MenuItem value="">{t('all')}</MenuItem>
        <MenuItem value="OPEN">{t('open')}</MenuItem>
        <MenuItem value="PARTIAL">{t('partial')}</MenuItem>
        <MenuItem value="PAID">{t('paid')}</MenuItem>
        <MenuItem value="CANCELLED">{t('cancelled')}</MenuItem>
      </AppSelect>
      <AppDatePicker label={t('dueDateFrom')} onChange={setDueDateFrom} value={dueDateFrom} />
      <AppDatePicker label={t('dueDateTo')} onChange={setDueDateTo} value={dueDateTo} />
      <FilterActions onReset={onReset} resetHref="/debts" />
    </DataTableToolbar>
  );
}
