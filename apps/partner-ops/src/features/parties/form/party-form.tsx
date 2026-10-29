'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { PartyType } from '@/lib/domain';
import { useSaveParty } from '../hooks/use-save-party';
import { toPartyRequest } from './to-party-request';
import {
  createPartyFormSchema,
  type PartyFormInput,
  type PartyFormValues,
  type PartyFormInitialValues,
} from './schema';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { FormActions, FormGrid } from '@/components/ui/form/layout';
import { AppInput } from '@/components/ui/form/input';
import { AppSelect } from '@/components/ui/form/select';
import { useFormDialog } from '@/components/ui/dialog/form-dialog';
import { useToast } from '@packages/ui-react';
import { applyApiFieldErrors } from '@/lib/form-errors';

export function PartyForm({
  users = [],
  initialValues,
  partyId,
  submitLabel,
}: {
  users?: Array<{ id: string; name: string; email: string }>;
  initialValues?: PartyFormInitialValues;
  partyId?: string;
  submitLabel?: string;
}) {
  const t = useTranslations('PartyForm');
  const partyFormSchema = createPartyFormSchema(t);
  const { closeDialog, setGuard } = useFormDialog();
  const { showToast } = useToast();
  const mutation = useSaveParty();
  const {
    control,
    register,
    handleSubmit,
    setError,
    trigger,
    formState: { errors, isSubmitted, isDirty },
  } = useForm<PartyFormInput, unknown, PartyFormValues>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      type: initialValues?.type ?? PartyType.CUSTOMER,
      code: initialValues?.code ?? '',
      name: initialValues?.name ?? '',
      phone: initialValues?.phone ?? '',
      email: initialValues?.email ?? '',
      taxCode: initialValues?.taxCode ?? '',
      creditLimit: initialValues?.creditLimit ?? '',
      assignedToId: initialValues?.assignedToId ?? '',
      address: initialValues?.address ?? '',
      provinceCode: initialValues?.provinceCode ?? '',
      provinceName: initialValues?.provinceName ?? '',
      note: initialValues?.note ?? '',
    },
  });

  useEffect(() => {
    setGuard({ dirty: isDirty, pending: mutation.isPending });
  }, [isDirty, mutation.isPending, setGuard]);

  useEffect(() => {
    if (isSubmitted) void trigger();
  }, [t, trigger, isSubmitted]);

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) =>
        mutation.mutate(
          partyId
            ? { id: partyId, data: toPartyRequest(values) }
            : { data: toPartyRequest(values) },
          {
            onSuccess: (party) => {
              closeDialog(partyId ? t('updated') : t('created'), { id: party.id });
              showToast({ message: partyId ? t('updated') : t('created') });
            },
            onError: (error) => applyApiFieldErrors(error, setError),
          },
        ),
      )}
      sx={{ display: 'grid', gap: 2 }}
    >
      <FormGrid>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <AppSelect
              label={t('type')}
              {...field}
              error={Boolean(errors.type)}
              helperText={errors.type?.message}
              value={field.value ?? PartyType.CUSTOMER}
            >
              <MenuItem value={PartyType.CUSTOMER}>{t('customer')}</MenuItem>
              <MenuItem value={PartyType.SUPPLIER}>{t('supplier')}</MenuItem>
              <MenuItem value={PartyType.BOTH}>{t('both')}</MenuItem>
            </AppSelect>
          )}
        />
        <AppInput
          label={t('code')}
          placeholder={t('codePlaceholder')}
          {...register('code')}
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
        />
        <AppInput
          label={t('name')}
          placeholder={t('namePlaceholder')}
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <AppInput
          label={t('phone')}
          {...register('phone')}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
        <AppInput
          label={t('email')}
          type="email"
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <AppInput
          label={t('taxCode')}
          {...register('taxCode')}
          error={Boolean(errors.taxCode)}
          helperText={errors.taxCode?.message}
        />
        <AppInput
          label={t('creditLimit')}
          placeholder="500000000"
          type="number"
          {...register('creditLimit')}
          error={Boolean(errors.creditLimit)}
          helperText={errors.creditLimit?.message}
        />
        <Controller
          control={control}
          name="assignedToId"
          render={({ field }) => (
            <AppSelect
              label={t('assignedTo')}
              {...field}
              error={Boolean(errors.assignedToId)}
              helperText={errors.assignedToId?.message}
              value={field.value ?? ''}
            >
              <MenuItem value="">{t('unassigned')}</MenuItem>
              {initialValues?.assignedToId &&
              !users.some((user) => user.id === initialValues.assignedToId) ? (
                <MenuItem value={initialValues.assignedToId}>{t('currentAssignee')}</MenuItem>
              ) : null}
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </AppSelect>
          )}
        />
      </FormGrid>
      <AppInput
        label={t('address')}
        {...register('address')}
        error={Boolean(errors.address)}
        helperText={errors.address?.message}
      />
      <FormGrid>
        <AppInput
          label={t('provinceCode')}
          placeholder={t('provinceCodePlaceholder')}
          {...register('provinceCode')}
          error={Boolean(errors.provinceCode)}
          helperText={errors.provinceCode?.message}
        />
        <AppInput
          label={t('provinceName')}
          placeholder={t('provinceNamePlaceholder')}
          {...register('provinceName')}
          error={Boolean(errors.provinceName)}
          helperText={errors.provinceName?.message}
        />
      </FormGrid>
      <AppInput
        label={t('note')}
        multiline
        rows={3}
        {...register('note')}
        error={Boolean(errors.note)}
        helperText={errors.note?.message}
      />
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          {submitLabel ?? t('create')}
        </Button>
      </FormActions>
    </Box>
  );
}
