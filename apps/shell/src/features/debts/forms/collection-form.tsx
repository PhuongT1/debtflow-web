'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, MenuItem } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '@packages/ui-react';
import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/form/date-picker';
import { FormActions, FormGrid } from '@/components/ui/form/layout';
import { applyApiFieldErrors } from '@/lib/forms/errors';
import { updateDebt } from '@/services/debt.client';

import type { CollectionFormProps } from './collection-form.types';

const collectionFormSchema = z.object({
  collectionStatus: z.enum(['NEW', 'CONTACTED', 'PROMISED', 'DISPUTED', 'ESCALATED']),
  assignedToId: z.string().trim().optional(),
  nextFollowUpAt: z.string().optional(),
  followUpNote: z.string().trim().optional(),
  invoiceNo: z.string().trim().optional(),
  orderNo: z.string().trim().optional(),
  contractNo: z.string().trim().optional(),
  poNo: z.string().trim().optional(),
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

function withoutEmptyValues(values: CollectionFormValues) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === '' ? undefined : value]),
  );
}

export function CollectionForm({ debtId, defaults, users }: CollectionFormProps) {
  const ui = useTranslations('Workspace');

  const router = useRouter();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: (values: CollectionFormValues) => updateDebt(debtId, withoutEmptyValues(values)),
    onSuccess: () => {
      showToast({ message: ui('collectionStatusUpdated') });
      router.refresh();
    },
  });
  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: {
      collectionStatus: defaults.collectionStatus as CollectionFormValues['collectionStatus'],
      assignedToId: defaults.assignedToId ?? '',
      nextFollowUpAt: defaults.nextFollowUpAt?.toISOString().slice(0, 10) ?? '',
      followUpNote: defaults.followUpNote ?? '',
      invoiceNo: defaults.invoiceNo ?? '',
      orderNo: defaults.orderNo ?? '',
      contractNo: defaults.contractNo ?? '',
      poNo: defaults.poNo ?? '',
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values, {
          onError: (error) => applyApiFieldErrors(error, setError, getValues()),
        }),
      )}
      sx={{ display: 'grid', gap: 2 }}
    >
      <FormInput
        select
        label={ui('collectionStatusText')}
        control={control}
        name={'collectionStatus'}
        error={Boolean(errors.collectionStatus)}
        helperText={errors.collectionStatus?.message}
      >
        <MenuItem value="NEW">{ui('new')}</MenuItem>
        <MenuItem value="CONTACTED">{ui('contacted')}</MenuItem>
        <MenuItem value="PROMISED">{ui('promisedPayment')}</MenuItem>
        <MenuItem value="DISPUTED">{ui('disputed')}</MenuItem>
        <MenuItem value="ESCALATED">{ui('escalationNeeded')}</MenuItem>
      </FormInput>
      <FormInput
        select
        label={ui('accountOwner')}
        control={control}
        name={'assignedToId'}
        error={Boolean(errors.assignedToId)}
        helperText={errors.assignedToId?.message}
      >
        <MenuItem value="">{ui('unassigned')}</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </FormInput>
      <Controller
        control={control}
        name="nextFollowUpAt"
        render={({ field }) => (
          <DatePicker
            error={Boolean(errors.nextFollowUpAt)}
            helperText={errors.nextFollowUpAt?.message}
            label={ui('nextFollowUp')}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <FormInput
        label={ui('collectionNotes')}
        multiline
        rows={3}
        control={control}
        name={'followUpNote'}
        error={Boolean(errors.followUpNote)}
        helperText={errors.followUpNote?.message}
      />
      <FormGrid>
        <FormInput
          label={ui('invoiceNumber')}
          control={control}
          name={'invoiceNo'}
          error={Boolean(errors.invoiceNo)}
          helperText={errors.invoiceNo?.message}
        />
        <FormInput
          label={ui('orderNumber')}
          control={control}
          name={'orderNo'}
          error={Boolean(errors.orderNo)}
          helperText={errors.orderNo?.message}
        />
        <FormInput
          label={ui('contract')}
          control={control}
          name={'contractNo'}
          error={Boolean(errors.contractNo)}
          helperText={errors.contractNo?.message}
        />
        <FormInput
          label="PO"
          control={control}
          name={'poNo'}
          error={Boolean(errors.poNo)}
          helperText={errors.poNo?.message}
        />
      </FormGrid>
      {errors.root?.server?.message ? (
        <Alert severity="error">{errors.root.server.message}</Alert>
      ) : null}
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          {ui('updateCollection')}
        </Button>
      </FormActions>
    </Box>
  );
}
