'use client';

import { partnerListLayout } from '@packages/platform-registry';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { AppDatePicker } from '@/components/ui/form/date-picker';
import { AppInput } from '@/components/ui/form/input';
import { AppSelect } from '@/components/ui/form/select';
import { DataTableToolbar } from '@/components/tables/toolbar';
import { FilterActions } from '@/components/ui/form/filter-actions';
import { partnerPlatform } from '@/lib/platform/client';
import { getPartyListFilters } from '../model/party-filters';
import { createPartyFilterSchema, type PartyFilterValues } from './filter.schema';
import type { UserSummary } from '@/models/user';
import { appRoutes } from '@/lib/routing/routes';

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
    register,
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
      <AppInput
        autoComplete="off"
        label={t('search')}
        placeholder={t('searchPlaceholder')}
        {...register('q')}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <AppSelect label={t('type')} {...field} value={field.value ?? ''}>
            <MenuItem value="">{t('all')}</MenuItem>
            <MenuItem value="CUSTOMER">{t('customer')}</MenuItem>
            <MenuItem value="SUPPLIER">{t('supplier')}</MenuItem>
            <MenuItem value="BOTH">{t('both')}</MenuItem>
          </AppSelect>
        )}
      />

      <Controller
        control={control}
        name="assignedToId"
        render={({ field }) => (
          <AppSelect label={t('owner')} {...field} value={field.value ?? ''}>
            <MenuItem value="">{t('all')}</MenuItem>
            {activeUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </AppSelect>
        )}
      />
      <Controller
        control={control}
        name="createdFrom"
        render={({ field }) => (
          <AppDatePicker
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
          <AppDatePicker
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
