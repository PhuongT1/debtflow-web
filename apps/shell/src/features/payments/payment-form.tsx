'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Checkbox, FormControlLabel, MenuItem } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { FormInput } from '@packages/ui-react';
import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { useFormDialog } from '@/components/ui/dialog/form-dialog';
import { DatePicker } from '@/components/ui/form/date-picker';
import { FormActions, FormGrid } from '@/components/ui/form/layout';
import { applyApiFieldErrors } from '@/lib/forms/errors';
import { autoAllocatePayment, recordDebtPayment } from '@/services/payment.client';

import type { PaymentFormProps } from './payment-form.types';

function createPaymentFormSchema(ui: (key: string) => string) {
  const paymentFormSchema = z.object({
    amount: z
      .string({
        required_error: ui('enterAPaymentAmount'),
        invalid_type_error: ui('enterAValidNumber'),
      })
      .trim()
      .min(1, ui('enterAPaymentAmount'))
      .refine((value) => Number.isFinite(Number(value)), ui('enterAValidNumber'))
      .refine((value) => Number(value) > 0, ui('thePaymentAmountMustBeGreaterThanZero')),
    paidAt: z.string().min(1, ui('selectAPaymentDate')),
    method: z.enum(['BANK_TRANSFER', 'CASH', 'OTHER']),
    referenceNo: z.string().trim().optional(),
    note: z.string().trim().optional(),
    autoAllocate: z.boolean(),
  });

  return paymentFormSchema;
}

type PaymentFormInput = z.input<ReturnType<typeof createPaymentFormSchema>>;
type PaymentFormValues = z.output<ReturnType<typeof createPaymentFormSchema>>;

export function PaymentForm({
  debtId,
  remainingAmount,
  partyId,
  type,
  onSuccess,
}: PaymentFormProps) {
  const ui = useTranslations('Workspace');

  const paymentFormSchema = createPaymentFormSchema(ui);
  const today = new Date().toISOString().slice(0, 10);
  const router = useRouter();
  const { closeDialog } = useFormDialog();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: ({ autoAllocate, ...values }: PaymentFormValues) =>
      autoAllocate
        ? autoAllocatePayment({ ...values, partyId, type })
        : recordDebtPayment(debtId, values),
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
      showToast({ message: ui('paymentRecordedSuccessfully') });
      router.refresh();
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    trigger,
    getValues,
    formState: { errors, isSubmitted },
  } = useForm<PaymentFormInput, unknown, PaymentFormValues>({
    resolver: zodResolver(
      paymentFormSchema.refine(
        (value) => value.autoAllocate || Number(value.amount) <= remainingAmount,
        { message: ui('thePaymentAmountCannotExceedTheRemainingBalance'), path: ['amount'] },
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
      <FormGrid>
        <FormInput
          label={ui('amountText')}
          type="number"
          control={control}
          name={'amount'}
          error={Boolean(errors.amount)}
          helperText={errors.amount?.message}
        />
        <Controller
          control={control}
          name="paidAt"
          render={({ field }) => (
            <DatePicker
              error={Boolean(errors.paidAt)}
              helperText={errors.paidAt?.message}
              label={ui('paymentDate')}
              onChange={field.onChange}
              required
              value={field.value}
            />
          )}
        />
        <FormInput
          select
          label={ui('methodText')}
          control={control}
          name={'method'}
          error={Boolean(errors.method)}
          helperText={errors.method?.message}
        >
          <MenuItem value="BANK_TRANSFER">{ui('bankTransfer')}</MenuItem>
          <MenuItem value="CASH">{ui('cash')}</MenuItem>
          <MenuItem value="OTHER">{ui('other')}</MenuItem>
        </FormInput>
        <FormInput
          label={ui('referenceNumber')}
          control={control}
          name={'referenceNo'}
          error={Boolean(errors.referenceNo)}
          helperText={errors.referenceNo?.message}
        />
      </FormGrid>
      <FormInput
        label={ui('notes')}
        multiline
        rows={3}
        control={control}
        name={'note'}
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
            label={ui('allocateAutomaticallyAcrossThisPartnerSDebtsEarliestDue')}
          />
        )}
      />
      {errors.root?.server?.message ? (
        <Alert severity="error">{errors.root.server.message}</Alert>
      ) : null}
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          {ui('recordPayment')}
        </Button>
      </FormActions>
    </Box>
  );
}
