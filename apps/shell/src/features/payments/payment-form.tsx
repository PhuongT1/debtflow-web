'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppDatePicker } from '@/components/ui/app-date-picker';
import { Button } from '@/components/ui/button';
import { useFormDialog } from '@/components/ui/form-dialog';
import { FormActions, FormGrid } from '@/components/ui/form-layout';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';
import { useToast } from '@debtflow/react-ui';
import { applyApiFieldErrors } from '@/lib/forms/errors';
import { autoAllocatePayment, recordDebtPayment } from '@/services/payment.client';

const paymentFormSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số tiền thanh toán')
    .refine((value) => Number.isFinite(Number(value)), 'Vui lòng nhập số hợp lệ')
    .refine((value) => Number(value) > 0, 'Số tiền thanh toán phải lớn hơn 0'),
  paidAt: z.string().min(1, 'Vui lòng chọn ngày thanh toán'),
  method: z.enum(['BANK_TRANSFER', 'CASH', 'OTHER']),
  referenceNo: z.string().trim().optional(),
  note: z.string().trim().optional(),
  autoAllocate: z.boolean(),
});

type PaymentFormInput = z.input<typeof paymentFormSchema>;
type PaymentFormValues = z.output<typeof paymentFormSchema>;

export function PaymentForm({
  debtId,
  remainingAmount,
  partyId,
  type,
  onSuccess,
}: {
  debtId: string;
  remainingAmount: number;
  partyId: string;
  type: 'PAYABLE' | 'RECEIVABLE';
  onSuccess?: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const router = useRouter();
  const { closeDialog } = useFormDialog();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: ({ autoAllocate, ...values }: PaymentFormValues) =>
      autoAllocate ? autoAllocatePayment({ ...values, partyId, type }) : recordDebtPayment(debtId, values),
    onSuccess: () => {
      reset({
        amount: '',
        autoAllocate: true,
        paidAt: today,
        method: 'BANK_TRANSFER',
        referenceNo: '',
        note: '',
      });
      closeDialog();
      onSuccess?.();
      showToast({ message: 'Đã ghi nhận thanh toán thành công.' });
      router.refresh();
    },
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<PaymentFormInput, unknown, PaymentFormValues>({
    resolver: zodResolver(
      paymentFormSchema.refine(
        (value) => value.autoAllocate || Number(value.amount) <= remainingAmount,
        { message: 'Số tiền thanh toán không được lớn hơn số còn lại', path: ['amount'] },
      ),
    ),
    defaultValues: {
      autoAllocate: true,
      paidAt: today,
      method: 'BANK_TRANSFER',
      referenceNo: '',
      note: '',
    },
  });

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
        <AppInput
          label="Số tiền *"
          type="number"
          {...register('amount')}
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
        />
        <Controller
          control={control}
          name="paidAt"
          render={({ field }) => (
            <AppDatePicker
              error={Boolean(errors.paidAt)}
              helperText={errors.paidAt?.message}
              label="Ngày thanh toán"
              onChange={field.onChange}
              required
              value={field.value}
            />
          )}
        />
        <AppSelect
          label="Phương thức *"
          {...register('method')}
          error={Boolean(errors.method)}
          helperText={errors.method?.message}
        >
          <MenuItem value="BANK_TRANSFER">Chuyển khoản</MenuItem>
          <MenuItem value="CASH">Tiền mặt</MenuItem>
          <MenuItem value="OTHER">Khác</MenuItem>
        </AppSelect>
        <AppInput
          label="Mã tham chiếu"
          {...register('referenceNo')}
          error={Boolean(errors.referenceNo)}
          helperText={errors.referenceNo?.message}
        />
      </FormGrid>
      <AppInput
        label="Ghi chú"
        multiline
        rows={3}
        {...register('note')}
        error={Boolean(errors.note)}
        helperText={errors.note?.message}
      />
      <Controller
        control={control}
        name="autoAllocate"
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox checked={field.value} onChange={(_, checked) => field.onChange(checked)} />
            }
            label="Tự cấn trừ các công nợ cùng đối tác (FIFO: đến hạn sớm trước)"
          />
        )}
      />
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          Ghi nhận thanh toán
        </Button>
      </FormActions>
    </Box>
  );
}
