'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { DataTableToolbar } from '@/components/ui/data-table-toolbar';
import { FilterActions } from '@/components/ui/filter-actions';
import { AppDatePicker } from '@/components/ui/app-date-picker';
import { AppInput } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

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
  const [status, setStatus] = useState(filters.status);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onApply({
      q: String(data.get('q') ?? '').trim(),
      status,
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
      <Select
        allowClear
        onChange={(value) => setStatus(typeof value === 'string' ? value : '')}
        options={[
          { label: t('open'), value: 'OPEN' },
          { label: t('partial'), value: 'PARTIAL' },
          { label: t('paid'), value: 'PAID' },
          { label: t('cancelled'), value: 'CANCELLED' },
        ]}
        placeholder={t('status')}
        value={status}
      />
      <AppDatePicker label={t('dueDateFrom')} onChange={setDueDateFrom} value={dueDateFrom} />
      <AppDatePicker label={t('dueDateTo')} onChange={setDueDateTo} value={dueDateTo} />
      <FilterActions
        onReset={() => {
          setDueDateFrom('');
          setDueDateTo('');
          setStatus('');
          onReset();
        }}
        resetHref="/debts"
      />
    </DataTableToolbar>
  );
}
