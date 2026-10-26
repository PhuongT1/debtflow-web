import { MenuItem } from '@mui/material';
import { Controller, type FieldErrors, type UseFormReturn } from 'react-hook-form';
import { AppDatePicker } from '@/components/ui/form/date-picker';
import { FormGrid } from '@/components/ui/form/layout';
import { AppInput } from '@/components/ui/form/input';
import { AppSelect } from '@/components/ui/form/select';
import type { DebtFormInput, DebtFormValues } from './schema';

type DebtFormFieldsProps = Pick<
  UseFormReturn<DebtFormInput, unknown, DebtFormValues>,
  'register' | 'control'
> & {
  errors: FieldErrors<DebtFormInput>;
  lineItemTotal: number;
  lockParty: boolean;
  parties: Array<{ id: string; name: string }>;
  users: Array<{ id: string; name: string; email: string }>;
};

export function DebtFormFields({
  register,
  control,
  errors,
  lineItemTotal,
  lockParty,
  parties,
  users,
}: DebtFormFieldsProps) {
  return (
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
          errors.originalAmount?.message ?? (lineItemTotal > 0 ? 'Tự tính từ dòng hàng' : undefined)
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
  );
}
