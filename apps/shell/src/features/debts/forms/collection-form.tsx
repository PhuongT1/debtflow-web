'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppDatePicker } from '@/components/ui/app-date-picker';
import { Button } from '@/components/ui/button';
import { FormActions, FormGrid } from '@/components/ui/form-layout';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';
import { useToast } from '@debtflow/react-ui';
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
    mutationFn: (values: CollectionFormValues) =>
      updateDebt(debtId, withoutEmptyValues(values)),
    onSuccess: () => {
      showToast({ message: 'Đã cập nhật trạng thái thu tiền.' });
      router.refresh();
    },
  });
  const {
    register,
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
      <AppSelect
        label="Trạng thái thu tiền *"
        {...register('collectionStatus')}
        error={Boolean(errors.collectionStatus)}
        helperText={errors.collectionStatus?.message}
      >
        <MenuItem value="NEW">Mới</MenuItem>
        <MenuItem value="CONTACTED">Đã liên hệ</MenuItem>
        <MenuItem value="PROMISED">Khách hẹn trả</MenuItem>
        <MenuItem value="DISPUTED">Đang tranh chấp</MenuItem>
        <MenuItem value="ESCALATED">Cần escalated</MenuItem>
      </AppSelect>
      <AppSelect
        label="Sale phụ trách"
        {...register('assignedToId')}
        error={Boolean(errors.assignedToId)}
        helperText={errors.assignedToId?.message}
      >
        <MenuItem value="">Chưa gán</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </AppSelect>
      <Controller
        control={control}
        name="nextFollowUpAt"
        render={({ field }) => (
          <AppDatePicker
            error={Boolean(errors.nextFollowUpAt)}
            helperText={errors.nextFollowUpAt?.message}
            label="Hẹn follow-up tiếp theo"
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <AppInput
        label="Ghi chú thu tiền"
        multiline
        rows={3}
        {...register('followUpNote')}
        error={Boolean(errors.followUpNote)}
        helperText={errors.followUpNote?.message}
      />
      <FormGrid>
        <AppInput
          label="Mã hóa đơn"
          {...register('invoiceNo')}
          error={Boolean(errors.invoiceNo)}
          helperText={errors.invoiceNo?.message}
        />
        <AppInput
          label="Mã đơn hàng"
          {...register('orderNo')}
          error={Boolean(errors.orderNo)}
          helperText={errors.orderNo?.message}
        />
        <AppInput
          label="Hợp đồng"
          {...register('contractNo')}
          error={Boolean(errors.contractNo)}
          helperText={errors.contractNo?.message}
        />
        <AppInput
          label="PO"
          {...register('poNo')}
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
