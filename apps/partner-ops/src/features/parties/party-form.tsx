'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { Button } from '@/components/ui/button';
import { FormActions, FormGrid } from '@/components/ui/form-layout';
import { AppInput } from '@/components/ui/input';
import { AppSelect } from '@/components/ui/select';
import { useFormDialog } from '@/components/ui/form-dialog';
import { useToast } from '@debtflow/react-ui';
import { requestJson } from '@/lib/api-client';
import { applyApiFieldErrors } from '@/lib/form-errors';

const optionalNumberString = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || Number.isFinite(Number(value)), 'Vui lòng nhập số hợp lệ')
  .refine((value) => !value || Number(value) >= 0, 'Hạn mức không được âm');

const partyFormSchema = z.object({
  type: z.enum(['CUSTOMER', 'SUPPLIER', 'BOTH']),
  code: z.string().trim().optional(),
  name: z.string().trim().min(1, 'Vui lòng nhập tên đối tác'),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Email không hợp lệ').optional().or(z.literal('')),
  taxCode: z.string().trim().optional(),
  creditLimit: optionalNumberString,
  assignedToId: z.string().trim().optional(),
  address: z.string().trim().optional(),
  provinceCode: z.string().trim().max(10).optional(),
  provinceName: z.string().trim().optional(),
  note: z.string().trim().optional(),
});

type PartyFormInput = z.input<typeof partyFormSchema>;
type PartyFormValues = z.output<typeof partyFormSchema>;

type PartyFormInitialValues = Partial<Omit<PartyFormInput, 'type'>> & {
  type?: PartyFormInput['type'];
};

function withoutEmptyValues(values: PartyFormValues) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === '' ? undefined : value]),
  );
}

export function PartyForm({
  users = [],
  initialValues,
  endpoint = '/api/parties',
  method = 'POST',
  submitLabel = 'Tạo đối tác',
}: {
  users?: Array<{ id: string; name: string; email: string }>;
  initialValues?: PartyFormInitialValues;
  endpoint?: string;
  method?: 'POST' | 'PATCH';
  submitLabel?: string;
}) {
  const queryClient = useQueryClient();
  const { closeDialog } = useFormDialog();
  const { showToast } = useToast();
  const mutation = useMutation({
    mutationFn: (values: PartyFormValues) =>
      requestJson(endpoint, {
        method,
        body: JSON.stringify(withoutEmptyValues(values)),
      }),
    onSuccess: () => {
      closeDialog();
      showToast({
        message:
          method === 'PATCH' ? 'Đã cập nhật đối tác thành công.' : 'Đã tạo đối tác thành công.',
      });
      void queryClient.invalidateQueries({ queryKey: ['parties'] });
    },
  });
  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PartyFormInput, unknown, PartyFormValues>({
    resolver: zodResolver(partyFormSchema),
    defaultValues: {
      type: initialValues?.type ?? 'CUSTOMER',
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
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <AppSelect
              label="Loại *"
              {...field}
              error={Boolean(errors.type)}
              helperText={errors.type?.message}
              value={field.value ?? 'CUSTOMER'}
            >
              <MenuItem value="CUSTOMER">Khách hàng</MenuItem>
              <MenuItem value="SUPPLIER">Nhà cung cấp</MenuItem>
              <MenuItem value="BOTH">Cả hai</MenuItem>
            </AppSelect>
          )}
        />
        <AppInput
          label="Mã"
          placeholder="KH-001"
          {...register('code')}
          error={Boolean(errors.code)}
          helperText={errors.code?.message}
        />
        <AppInput
          label="Tên *"
          placeholder="Công ty ABC"
          {...register('name')}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />
        <AppInput
          label="Điện thoại"
          {...register('phone')}
          error={Boolean(errors.phone)}
          helperText={errors.phone?.message}
        />
        <AppInput
          label="Email"
          type="email"
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />
        <AppInput
          label="Mã số thuế"
          {...register('taxCode')}
          error={Boolean(errors.taxCode)}
          helperText={errors.taxCode?.message}
        />
        <AppInput
          label="Hạn mức công nợ"
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
              label="Sale phụ trách"
              {...field}
              error={Boolean(errors.assignedToId)}
              helperText={errors.assignedToId?.message}
              value={field.value ?? ''}
            >
              <MenuItem value="">Chưa gán</MenuItem>
              {initialValues?.assignedToId &&
              !users.some((user) => user.id === initialValues.assignedToId) ? (
                <MenuItem value={initialValues.assignedToId}>Người phụ trách hiện tại</MenuItem>
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
        label="Địa chỉ"
        {...register('address')}
        error={Boolean(errors.address)}
        helperText={errors.address?.message}
      />
      <FormGrid>
        <AppInput
          label="Mã tỉnh / thành"
          placeholder="HCM"
          {...register('provinceCode')}
          error={Boolean(errors.provinceCode)}
          helperText={errors.provinceCode?.message}
        />
        <AppInput
          label="Tỉnh / thành"
          placeholder="TP. Hồ Chí Minh"
          {...register('provinceName')}
          error={Boolean(errors.provinceName)}
          helperText={errors.provinceName?.message}
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
      <ApiErrorNotice error={mutation.error} />
      <FormActions>
        <Button loading={mutation.isPending} type="submit">
          {submitLabel}
        </Button>
      </FormActions>
    </Box>
  );
}
