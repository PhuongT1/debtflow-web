'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { partnerListLayout } from '@packages/platform-registry';
import { FormInput } from '@packages/ui-react';

import { DataTableToolbar } from '@/components/tables/toolbar';
import { DatePicker } from '@/components/ui/form/date-picker';
import { FilterActions } from '@/components/ui/form/filter-actions';
import { SelectField } from '@/components/ui/form/select';
import { partnerPlatform } from '@/lib/platform/client';
import { appRoutes } from '@/lib/routing/routes';
import type { UserSummary } from '@/models/user';

import { getPartyListFilters } from '../model/party-filters';

import { createPartyFilterSchema, type PartyFilterValues } from './filter.schema';

type PartyListToolbarProps = {
  activeUsers: UserSummary[];
};

export function PartyListToolbar({ activeUsers }: PartyListToolbarProps) {
  const t = useTranslations('Parties');
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const filters = getPartyListFilters(searchParams);
  const filterSchema = useMemo(() => createPartyFilterSchema(t('invalidDateRange')), [t]);
  const filterDefaults = useMemo<PartyFilterValues>(() => {
    const params = new URLSearchParams(searchKey);

    return {
      q: params.get('q') ?? '',
      type: params.get('type') ?? '',
      assignedToId: params.get('assignedToId') ?? '',
      balanceType: params.get('balanceType') ?? '',
      createdFrom: params.get('createdFrom') ?? '',
      createdTo: params.get('createdTo') ?? '',
    };
  }, [searchKey]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartyFilterValues>({
    defaultValues: filterDefaults,
    resolver: zodResolver(filterSchema),
  });

  useEffect(() => reset(filterDefaults), [filterDefaults, reset]);

  function applyFilters(values: PartyFilterValues) {
    const nextParams = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
    });
    if (filters.pageSize) nextParams.set('pageSize', filters.pageSize);

    const path = appRoutes.parties.filtered(Object.fromEntries(nextParams));
    if (partnerPlatform.isEmbedded()) partnerPlatform.navigate({ path });
    else router.push(path, { scroll: false });
  }

  function clearFilters() {
    reset({
      q: '',
      type: '',
      assignedToId: '',
      balanceType: '',
      createdFrom: '',
      createdTo: '',
    });
    if (partnerPlatform.isEmbedded()) partnerPlatform.navigate({ path: appRoutes.parties.list });
    else router.replace(appRoutes.parties.list, { scroll: false });
  }

  return (
    <DataTableToolbar
      columns={partnerListLayout.toolbarColumns}
      onSubmit={handleSubmit(applyFilters)}
    >
      <FormInput
        autoComplete="off"
        label={t('search')}
        placeholder={t('searchPlaceholder')}
        control={control}
        name={'q'}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SelectField label={t('type')} {...field} value={field.value ?? ''}>
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="CUSTOMER">{t('customer')}</MenuItem>
            <MenuItem value="SUPPLIER">{t('supplier')}</MenuItem>
            <MenuItem value="BOTH">{t('both')}</MenuItem>
          </SelectField>
        )}
      />

      <Controller
        control={control}
        name="assignedToId"
        render={({ field }) => (
          <SelectField label={t('owner')} {...field} value={field.value ?? ''}>
            <MenuItem value="">{t('all')}</MenuItem>
            {activeUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </SelectField>
        )}
      />
      <Controller
        control={control}
        name="createdFrom"
        render={({ field }) => (
          <DatePicker
            error={Boolean(errors.createdFrom)}
            helperText={errors.createdFrom?.message}
            label={t('createdFrom')}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Controller
        control={control}
        name="createdTo"
        render={({ field }) => (
          <DatePicker
            error={Boolean(errors.createdTo)}
            helperText={errors.createdTo?.message}
            label={t('createdTo')}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <FilterActions onReset={clearFilters} resetHref={appRoutes.parties.list} />
    </DataTableToolbar>
  );
}
