'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

import { FormInput } from '@packages/ui-react';
import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { useFormDialog } from '@/components/ui/dialog/form-dialog';
import { FormActions, FormGrid } from '@/components/ui/form/layout';
import { SelectField } from '@/components/ui/form/select';
import { PartyType } from '@/lib/domain';
import { applyApiFieldErrors } from '@/lib/form-errors';

import { useSaveParty } from '../hooks/use-save-party';

import type { PartyFormProps } from './party-form.types';
import { createPartyFormSchema, type PartyFormInput, type PartyFormValues } from './schema';
import { toPartyRequest } from './to-party-request';

export function PartyForm({ users = [], initialValues, partyId, submitLabel }: PartyFormProps) {
  const t = useTranslations('PartyForm');
  const partyFormSchema = createPartyFormSchema(t);
  const { closeDialog, setGuard } = useFormDialog();
  const { showToast } = useToast();
  const mutation = useSaveParty();
  const {
    control,
    handleSubmit,
    setError,
    getValues,
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
            onError: (error) => applyApiFieldErrors(error, setError, getValues()),
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
            <SelectField
              label={t('type')}
              {...field}
              error={Boolean(errors.type)}
              helperText={errors.type?.message}
              value={field.value ?? PartyType.CUSTOMER}
            >
              <MenuItem value={PartyType.CUSTOMER}>{t('customer')}</MenuItem>
              <MenuItem value={PartyType.SUPPLIER}>{t('supplier')}</MenuItem>
              <MenuItem value={PartyType.BOTH}>{t('both')}</MenuItem>
            </SelectField>
          )}
        />
        <FormInput
          label={t('code')}
          placeholder={t('codePlaceholder')}
          control={control}
          name="code"
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
        />
        <FormInput
          label={t('name')}
          placeholder={t('namePlaceholder')}
          control={control}
          name="name"
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <FormInput
          label={t('phone')}
          control={control}
          name="phone"
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
        <FormInput
          label={t('email')}
          type="email"
          control={control}
          name="email"
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <FormInput
          label={t('taxCode')}
          control={control}
          name="taxCode"
          error={Boolean(errors.taxCode)}
          helperText={errors.taxCode?.message}
        />
        <FormInput
          label={t('creditLimit')}
          placeholder="500000000"
          type="number"
          control={control}
          name="creditLimit"
          error={Boolean(errors.creditLimit)}
          helperText={errors.creditLimit?.message}
        />
        <Controller
          control={control}
          name="assignedToId"
          render={({ field }) => (
            <SelectField
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
            </SelectField>
          )}
        />
      </FormGrid>
      <FormInput
        label={t('address')}
        control={control}
        name="address"
        error={Boolean(errors.address)}
        helperText={errors.address?.message}
      />
      <FormGrid>
        <FormInput
          label={t('provinceCode')}
          placeholder={t('provinceCodePlaceholder')}
          control={control}
          name="provinceCode"
          error={Boolean(errors.provinceCode)}
          helperText={errors.provinceCode?.message}
        />
        <FormInput
          label={t('provinceName')}
          placeholder={t('provinceNamePlaceholder')}
          control={control}
          name="provinceName"
          error={Boolean(errors.provinceName)}
          helperText={errors.provinceName?.message}
        />
      </FormGrid>
      <FormInput
        label={t('note')}
        multiline
        rows={3}
        control={control}
        name="note"
        error={Boolean(errors.note)}
        helperText={errors.note?.message}
      />
      {errors.root?.server?.message ? (
        <Alert severity="error">{errors.root.server.message}</Alert>
      ) : null}
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          {submitLabel ?? t('create')}
        </Button>
      </FormActions>
    </Box>
  );
}
