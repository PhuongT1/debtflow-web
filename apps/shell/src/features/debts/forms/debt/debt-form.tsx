'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { FormActions } from '@/components/ui/form/layout';
import { AppInput } from '@/components/ui/form/input';
import { useFormDialog } from '@/components/ui/dialog/form-dialog';
import { useToast } from '@packages/ui-react';
import { applyApiFieldErrors } from '@/lib/forms/errors';
import { getCatalogOptions } from '@/services/catalog.client';
import { listPartyOptions } from '@/services/party.client';
import { createDebt } from '@/services/debt.client';
import { DebtLineItems } from './line-items';
import { debtFormSchema, type DebtFormInput, type DebtFormValues } from './schema';
import { DebtFormFields } from './fields';

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
}: {
  parties?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string; email: string }>;
  defaultPartyId?: string;
  lockParty?: boolean;
  onSuccess?: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const router = useRouter();
  const { closeDialog } = useFormDialog();
  const { showToast } = useToast();
  const catalogQuery = useQuery({
    queryKey: ['catalog-options'],
    queryFn: getCatalogOptions,
    staleTime: 5 * 60_000,
  });
  const partyOptionsQuery = useQuery({
    enabled: initialParties === undefined,
    queryKey: ['parties', 'options'],
    queryFn: ({ signal }) => listPartyOptions(signal),
    staleTime: 5 * 60_000,
  });
  const parties = initialParties ?? partyOptionsQuery.data ?? [];
  const mutation = useMutation({
    mutationFn: (values: DebtFormValues) => createDebt(withoutEmptyValues(values)),
    onSuccess: () => {
      closeDialog();
      onSuccess?.();
      showToast({ message: 'Đã tạo công nợ thành công.' });
      router.refresh();
    },
  });
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
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

  return (
    <Box
      component="form"
      noValidate
      onSubmit={handleSubmit((values) =>
        mutation.mutate(values, { onError: (error) => applyApiFieldErrors(error, setError) }),
      )}
      sx={{ display: 'grid', gap: 2 }}
    >
      <DebtFormFields
        register={register}
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
        register={register}
      />
      <AppInput
        label="Ghi chú thu tiền"
        placeholder="VD: Khách hẹn thanh toán thứ Sáu"
        {...register('followUpNote')}
        error={Boolean(errors.followUpNote)}
        helperText={errors.followUpNote?.message}
      />
      <AppInput
        label="Mô tả"
        multiline
        rows={3}
        {...register('description')}
        error={Boolean(errors.description)}
        helperText={errors.description?.message}
      />
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button disabled={parties.length === 0} loading={mutation.isPending} type="submit">
          Tạo công nợ
        </Button>
      </FormActions>
    </Box>
  );
}
