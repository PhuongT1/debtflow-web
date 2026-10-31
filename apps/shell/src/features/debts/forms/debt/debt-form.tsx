'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';

import { FormInput } from '@packages/ui-react';
import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { useFormDialog } from '@/components/ui/dialog/form-dialog';
import { FormActions } from '@/components/ui/form/layout';
import { applyApiFieldErrors } from '@/lib/forms/errors';
import { queryKeys } from '@/lib/query/query-keys';
import { getCatalogOptions } from '@/services/catalog.client';
import { createDebt } from '@/services/debt.client';
import { listPartyOptions } from '@/services/party.client';

import type { DebtFormProps } from './debt-form.types';
import { DebtFormFields } from './fields';
import { DebtLineItems } from './line-items';
import { createDebtFormSchema, type DebtFormInput, type DebtFormValues } from './schema';

export type { DebtFormInput } from './schema';

function withoutEmptyValues(values: DebtFormValues) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === '' ? undefined : value]),
  );
}

export function DebtForm({
  parties: initialParties,
  users = [],
  defaultPartyId,
  lockParty = false,
  onSuccess,
}: DebtFormProps) {
  const ui = useTranslations('Workspace');

  const debtFormSchema = createDebtFormSchema(ui);
  const today = new Date().toISOString().slice(0, 10);
  const router = useRouter();
  const { closeDialog } = useFormDialog();
  const { showToast } = useToast();
  const catalogQuery = useQuery({
    queryKey: queryKeys.catalog.options(),
    queryFn: getCatalogOptions,
    staleTime: 5 * 60_000,
  });
  const partyOptionsQuery = useQuery({
    enabled: initialParties === undefined,
    queryKey: queryKeys.parties.options(),
    queryFn: ({ signal }) => listPartyOptions(signal),
    staleTime: 5 * 60_000,
  });
  const parties = initialParties ?? partyOptionsQuery.data ?? [];
  const mutation = useMutation({
    mutationFn: (values: DebtFormValues) => createDebt(withoutEmptyValues(values)),
    onSuccess: () => {
      closeDialog();
      onSuccess?.();
      showToast({ message: ui('debtCreatedSuccessfully') });
      router.refresh();
    },
  });
  const {
    control,
    handleSubmit,
    setError,
    trigger,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<DebtFormInput, unknown, DebtFormValues>({
    resolver: zodResolver(debtFormSchema),
    defaultValues: {
      type: 'RECEIVABLE',
      partyId: defaultPartyId ?? '',
      assignedToId: '',
      title: '',
      invoiceNo: '',
      orderNo: '',
      contractNo: '',
      issueDate: today,
      dueDate: today,
      nextFollowUpAt: '',
      followUpNote: '',
      description: '',
      salesChannel: 'STORE',
      items: [],
    },
  });
  const lineItems = useWatch({ control, name: 'items' });
  const lineItemTotal = (lineItems ?? []).reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );

  useEffect(() => {
    if (lineItemTotal > 0) setValue('originalAmount', String(lineItemTotal));
  }, [lineItemTotal, setValue]);

  useEffect(() => {
    if (isSubmitted) void trigger();
  }, [ui, trigger, isSubmitted]);

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
      <DebtFormFields
        control={control}
        errors={errors}
        lineItemTotal={lineItemTotal}
        lockParty={lockParty}
        parties={parties}
        users={users}
      />
      <DebtLineItems
        catalog={catalogQuery.data ?? { brands: [], categories: [], products: [], provinces: [] }}
        control={control}
      />
      <FormInput
        label={ui('collectionNotes')}
        placeholder={ui('forExampleCustomerPromisedToPayOnFriday')}
        control={control}
        name={'followUpNote'}
        error={Boolean(errors.followUpNote)}
        helperText={errors.followUpNote?.message}
      />
      <FormInput
        label={ui('description')}
        multiline
        rows={3}
        control={control}
        name={'description'}
        error={Boolean(errors.description)}
        helperText={errors.description?.message}
      />
      {errors.root?.server?.message ? (
        <Alert severity="error">{errors.root.server.message}</Alert>
      ) : null}
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button disabled={parties.length === 0} loading={mutation.isPending} type="submit">
          {ui('createDebt')}
        </Button>
      </FormActions>
    </Box>
  );
}
