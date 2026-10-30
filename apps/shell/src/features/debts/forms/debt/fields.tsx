import { MenuItem } from '@mui/material';
import { Controller, type FieldErrors, type UseFormReturn } from 'react-hook-form';

import { FormInput } from '@packages/ui-react';

import { DatePicker } from '@/components/ui/form/date-picker';
import { FormGrid } from '@/components/ui/form/layout';

import type { DebtFormInput, DebtFormValues } from './schema';

type DebtFormFieldsProps = Pick<
  UseFormReturn<DebtFormInput, unknown, DebtFormValues>,
  'control'
> & {
  errors: FieldErrors<DebtFormInput>;
  lineItemTotal: number;
  lockParty: boolean;
  parties: Array<{ id: string; name: string }>;
  users: Array<{ id: string; name: string; email: string }>;
};

export function DebtFormFields({
  control,
  errors,
  lineItemTotal,
  lockParty,
  parties,
  users,
}: DebtFormFieldsProps) {
  return (
    <FormGrid>
      <FormInput
        select
        label="Loại công nợ *"
        control={control}
        name={'type'}
        error={Boolean(errors.type)}
        helperText={errors.type?.message}
      >
        <MenuItem value="RECEIVABLE">Phải thu</MenuItem>
        <MenuItem value="PAYABLE">Phải trả</MenuItem>
      </FormInput>
      <FormInput
        select
        disabled={lockParty}
        label="Đối tác *"
        control={control}
        name={'partyId'}
        error={Boolean(errors.partyId)}
        helperText={errors.partyId?.message}
      >
        <MenuItem value="">Chọn đối tác</MenuItem>
        {parties.map((party) => (
          <MenuItem key={party.id} value={party.id}>
            {party.name}
          </MenuItem>
        ))}
      </FormInput>
      <FormInput
        select
        label="Kênh bán / nguồn hàng"
        control={control}
        name={'salesChannel'}
        error={Boolean(errors.salesChannel)}
        helperText={errors.salesChannel?.message}
      >
        <MenuItem value="STORE">Tại quầy</MenuItem>
        <MenuItem value="ONLINE">Online</MenuItem>
        <MenuItem value="WHOLESALE">Bán sỉ</MenuItem>
      </FormInput>
      <FormInput
        select
        label="Sale phụ trách"
        control={control}
        name={'assignedToId'}
        error={Boolean(errors.assignedToId)}
        helperText={errors.assignedToId?.message}
      >
        <MenuItem value="">Theo khách hàng / chưa gán</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </FormInput>
      <FormInput
        label="Tiêu đề *"
        placeholder="Công nợ hóa đơn..."
        control={control}
        name={'title'}
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
      />
      <FormInput
        label="Mã hóa đơn"
        placeholder="INV-..."
        control={control}
        name={'invoiceNo'}
        error={Boolean(errors.invoiceNo)}
        helperText={errors.invoiceNo?.message}
      />
      <FormInput
        label="Mã đơn hàng"
        placeholder="SO-..."
        control={control}
        name={'orderNo'}
        error={Boolean(errors.orderNo)}
        helperText={errors.orderNo?.message}
      />
      <FormInput
        label="Hợp đồng / PO"
        placeholder="HD-..."
        control={control}
        name={'contractNo'}
        error={Boolean(errors.contractNo)}
        helperText={errors.contractNo?.message}
      />
      <FormInput
        label="Tổng công nợ *"
        type="number"
        control={control}
        name={'originalAmount'}
        error={Boolean(errors.originalAmount)}
        helperText={
          errors.originalAmount?.message ?? (lineItemTotal > 0 ? 'Tự tính từ dòng hàng' : undefined)
        }
      />
      <Controller
        control={control}
        name="issueDate"
        render={({ field }) => (
          <DatePicker
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
          <DatePicker
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
          <DatePicker
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
