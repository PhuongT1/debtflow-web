'use client';

import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
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

export function CollectionForm({
  debtId,
  defaults,
  users,
}: {
  debtId: string;
  defaults: {
    assignedToId?: string | null;
    collectionStatus: string;
    nextFollowUpAt?: Date | null;
    followUpNote?: string | null;
    invoiceNo?: string | null;
    orderNo?: string | null;
    contractNo?: string | null;
    poNo?: string | null;
  };
  users: Array<{ id: string; name: string; email: string }>;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: (values: CollectionFormValues) => updateDebt(debtId, withoutEmptyValues(values)),
    onSuccess: () => {
      showToast({ message: 'Đã cập nhật trạng thái thu tiền.' });
      router.refresh();
    },
  });
  const {
    control,
    handleSubmit,
    setError,
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
        mutation.mutate(values, { onError: (error) => applyApiFieldErrors(error, setError) }),
      )}
      sx={{ display: 'grid', gap: 2 }}
    >
      <FormInput
        select
        label="Trạng thái thu tiền *"
        control={control}
        name={'collectionStatus'}
        error={Boolean(errors.collectionStatus)}
        helperText={errors.collectionStatus?.message}
      >
        <MenuItem value="NEW">Mới</MenuItem>
        <MenuItem value="CONTACTED">Đã liên hệ</MenuItem>
        <MenuItem value="PROMISED">Khách hẹn trả</MenuItem>
        <MenuItem value="DISPUTED">Đang tranh chấp</MenuItem>
        <MenuItem value="ESCALATED">Cần escalated</MenuItem>
      </FormInput>
      <FormInput
        select
        label="Sale phụ trách"
        control={control}
        name={'assignedToId'}
        error={Boolean(errors.assignedToId)}
        helperText={errors.assignedToId?.message}
      >
        <MenuItem value="">Chưa gán</MenuItem>
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
            label="Hẹn follow-up tiếp theo"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <FormInput
        label="Ghi chú thu tiền"
        multiline
        rows={3}
        control={control}
        name={'followUpNote'}
        error={Boolean(errors.followUpNote)}
        helperText={errors.followUpNote?.message}
      />
      <FormGrid>
        <FormInput
          label="Mã hóa đơn"
          control={control}
          name={'invoiceNo'}
          error={Boolean(errors.invoiceNo)}
          helperText={errors.invoiceNo?.message}
        />
        <FormInput
          label="Mã đơn hàng"
          control={control}
          name={'orderNo'}
          error={Boolean(errors.orderNo)}
          helperText={errors.orderNo?.message}
        />
        <FormInput
          label="Hợp đồng"
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
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          Cập nhật thu tiền
        </Button>
      </FormActions>
    </Box>
  );
}
