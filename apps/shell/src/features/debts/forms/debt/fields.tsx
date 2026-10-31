import { MenuItem } from '@mui/material';
import { useTranslations } from 'next-intl';
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
  const ui = useTranslations('Workspace');

  return (
    <FormGrid>
      <FormInput
        select
        label={ui('debtType')}
        control={control}
        name={'type'}
        error={Boolean(errors.type)}
        helperText={errors.type?.message}
      >
        <MenuItem value="RECEIVABLE">{ui('receivable')}</MenuItem>
        <MenuItem value="PAYABLE">{ui('payable')}</MenuItem>
      </FormInput>
      <FormInput
        select
        disabled={lockParty}
        label={ui('partner')}
        control={control}
        name={'partyId'}
        error={Boolean(errors.partyId)}
        helperText={errors.partyId?.message}
      >
        <MenuItem value="">{ui('selectAPartner')}</MenuItem>
        {parties.map((party) => (
          <MenuItem key={party.id} value={party.id}>
            {party.name}
          </MenuItem>
        ))}
      </FormInput>
      <FormInput
        select
        label={ui('salesPurchasingChannel')}
        control={control}
        name={'salesChannel'}
        error={Boolean(errors.salesChannel)}
        helperText={errors.salesChannel?.message}
      >
        <MenuItem value="STORE">{ui('inStore')}</MenuItem>
        <MenuItem value="ONLINE">{ui('online')}</MenuItem>
        <MenuItem value="WHOLESALE">{ui('wholesale')}</MenuItem>
      </FormInput>
      <FormInput
        select
        label={ui('accountOwner')}
        control={control}
        name={'assignedToId'}
        error={Boolean(errors.assignedToId)}
        helperText={errors.assignedToId?.message}
      >
        <MenuItem value="">{ui('useTheCustomerOwnerUnassigned')}</MenuItem>
        {users.map((user) => (
          <MenuItem key={user.id} value={user.id}>
            {user.name}
          </MenuItem>
        ))}
      </FormInput>
      <FormInput
        label={ui('title')}
        placeholder={ui('invoiceDebt')}
        control={control}
        name={'title'}
        error={Boolean(errors.title)}
        helperText={errors.title?.message}
      />
      <FormInput
        label={ui('invoiceNumber')}
        placeholder="INV-..."
        control={control}
        name={'invoiceNo'}
        error={Boolean(errors.invoiceNo)}
        helperText={errors.invoiceNo?.message}
      />
      <FormInput
        label={ui('orderNumber')}
        placeholder="SO-..."
        control={control}
        name={'orderNo'}
        error={Boolean(errors.orderNo)}
        helperText={errors.orderNo?.message}
      />
      <FormInput
        label={ui('contractPo')}
        placeholder="HD-..."
        control={control}
        name={'contractNo'}
        error={Boolean(errors.contractNo)}
        helperText={errors.contractNo?.message}
      />
      <FormInput
        label={ui('totalDebtText')}
        type="number"
        control={control}
        name={'originalAmount'}
        error={Boolean(errors.originalAmount)}
        helperText={
          errors.originalAmount?.message ??
          (lineItemTotal > 0 ? ui('calculatedFromLineItems') : undefined)
        }
      />
      <Controller
        control={control}
        name="issueDate"
        render={({ field }) => (
          <DatePicker
            error={Boolean(errors.issueDate)}
            helperText={errors.issueDate?.message}
            label={ui('issueDate')}
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
            label={ui('dueDate')}
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
            label={ui('followUp')}
            onChange={field.onChange}
            value={field.value}
          />
        )}
      />
    </FormGrid>
  );
}
