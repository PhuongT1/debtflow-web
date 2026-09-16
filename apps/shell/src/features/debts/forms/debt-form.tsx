'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppDatePicker } from '@/components/ui/app-date-picker';
import { Button } from '@/components/ui/button';
import { FormActions, FormGrid } from '@/components/ui/form-layout';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';
import { useFormDialog } from '@/components/ui/form-dialog';
import { useToast } from '@debtflow/react-ui';
import { applyApiFieldErrors } from '@/lib/forms/errors';
import { getCatalogOptions } from '@/services/catalog.client';
import { listPartyOptions } from '@/services/party.client';
import { createDebt } from '@/services/debt.client';
import { DebtLineItems } from './debt-line-items';

const optionalDate = z.string().optional();
const positiveNumberString = z
  .string()
  .trim()
  .min(1, 'Vui lòng nhập số tiền')
  .refine((value) => Number.isFinite(Number(value)), 'Vui lòng nhập số hợp lệ')
  .refine((value) => Number(value) > 0, 'Số tiền phải lớn hơn 0');

const debtFormSchema = z
  .object({
    type: z.enum(['RECEIVABLE', 'PAYABLE']),
    partyId: z.string().min(1, 'Vui lòng chọn đối tác'),
    assignedToId: z.string().trim().optional(),
    title: z.string().trim().min(1, 'Vui lòng nhập tiêu đề công nợ'),
    invoiceNo: z.string().trim().optional(),
    orderNo: z.string().trim().optional(),
    contractNo: z.string().trim().optional(),
    originalAmount: positiveNumberString,
    issueDate: z.string().min(1, 'Vui lòng chọn ngày phát sinh'),
    dueDate: z.string().min(1, 'Vui lòng chọn ngày đến hạn'),
    nextFollowUpAt: optionalDate,
    followUpNote: z.string().trim().optional(),
    description: z.string().trim().optional(),
    salesChannel: z.enum(['STORE', 'ONLINE', 'WHOLESALE']).optional(),
    items: z.array(
      z.object({
        productId: z.string(),
        quantity: positiveNumberString,
        unitPrice: positiveNumberString,
      }),
    ),
  })
  .refine((value) => !value.issueDate || !value.dueDate || value.dueDate >= value.issueDate, {
    message: 'Ngày đến hạn phải sau hoặc bằng ngày phát sinh',
    path: ['dueDate'],
  });

export type DebtFormInput = z.input<typeof debtFormSchema>;
type DebtFormValues = z.output<typeof debtFormSchema>;

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
    mutationFn: (values: DebtFormValues) =>
      createDebt(withoutEmptyValues(values)),
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
      <FormGrid>
        <AppSelect
          label="Loại công nợ *"
          {...register('type')}
          error={Boolean(errors.type)}
          helperText={errors.type?.message}
        >
          <MenuItem value="RECEIVABLE">Phải thu</MenuItem>
          <MenuItem value="PAYABLE">Phải trả</MenuItem>
        </AppSelect>
        <AppSelect
          disabled={lockParty}
          label="Đối tác *"
          {...register('partyId')}
          error={Boolean(errors.partyId)}
          helperText={errors.partyId?.message}
        >
          <MenuItem value="">Chọn đối tác</MenuItem>
          {parties.map((party) => (
            <MenuItem key={party.id} value={party.id}>
              {party.name}
            </MenuItem>
          ))}
        </AppSelect>
        <AppSelect
          label="Kênh bán / nguồn hàng"
          {...register('salesChannel')}
          error={Boolean(errors.salesChannel)}
          helperText={errors.salesChannel?.message}
        >
          <MenuItem value="STORE">Tại quầy</MenuItem>
          <MenuItem value="ONLINE">Online</MenuItem>
          <MenuItem value="WHOLESALE">Bán sỉ</MenuItem>
        </AppSelect>
        <AppSelect
          label="Sale phụ trách"
          {...register('assignedToId')}
          error={Boolean(errors.assignedToId)}
          helperText={errors.assignedToId?.message}
        >
          <MenuItem value="">Theo khách hàng / chưa gán</MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </AppSelect>
        <AppInput
          label="Tiêu đề *"
          placeholder="Công nợ hóa đơn..."
          {...register('title')}
          error={Boolean(errors.title)}
          helperText={errors.title?.message}
        />
        <AppInput
          label="Mã hóa đơn"
          placeholder="INV-..."
          {...register('invoiceNo')}
          error={Boolean(errors.invoiceNo)}
          helperText={errors.invoiceNo?.message}
        />
        <AppInput
          label="Mã đơn hàng"
          placeholder="SO-..."
          {...register('orderNo')}
          error={Boolean(errors.orderNo)}
          helperText={errors.orderNo?.message}
        />
        <AppInput
          label="Hợp đồng / PO"
          placeholder="HD-..."
          {...register('contractNo')}
          error={Boolean(errors.contractNo)}
          helperText={errors.contractNo?.message}
        />
        <AppInput
          label="Tổng công nợ *"
          type="number"
          {...register('originalAmount')}
          error={Boolean(errors.originalAmount)}
          helperText={
            errors.originalAmount?.message ??
            (lineItemTotal > 0 ? 'Tự tính từ dòng hàng' : undefined)
          }
        />
        <Controller
          control={control}
          name="issueDate"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.issueDate)}
              helperText={errors.issueDate?.message}
              label="Ngày phát sinh"
              onChange={field.onChange}
              required
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="dueDate"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.dueDate)}
              helperText={errors.dueDate?.message}
              label="Ngày đến hạn"
              onChange={field.onChange}
              required
              value={field.value}
            />
          )}
        />
        <Controller
          control={control}
          name="nextFollowUpAt"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.nextFollowUpAt)}
              helperText={errors.nextFollowUpAt?.message}
              label="Hẹn follow-up"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </FormGrid>
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
