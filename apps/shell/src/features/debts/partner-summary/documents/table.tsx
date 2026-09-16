'use client';

import { Box, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppTable } from '@/components/ui/app-table';
import { Badge } from '@/components/ui/badge';
import { FormDialog } from '@/components/ui/form-dialog';
import { PaymentForm } from '@/features/payments/payment-form';
import { formatMoney } from '@/lib/presentation/formatters';
import type { PartnerDebtPage } from './types';

type Translate = ReturnType<typeof useTranslations>;
type Props = {
  locale: string;
  onPaymentRecorded: () => void;
  debts: PartnerDebtPage;
  t: Translate;
};

const statusTone = {
  OPEN: 'blue',
  PARTIAL: 'amber',
  PAID: 'green',
  CANCELLED: 'red',
} as const;
const statusKey = {
  OPEN: 'open',
  PARTIAL: 'partial',
  PAID: 'paid',
  CANCELLED: 'cancelled',
} as const;

export function PartnerDebtsTable({ debts, locale, onPaymentRecorded, t }: Props) {
  if (debts.items.length === 0) {
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', flex: 1, justifyContent: 'center' }}>
        <Typography color="text.secondary">{t('empty')}</Typography>
      </Box>
    );
  }

  return (
    <AppTable fillAvailable minWidth={1120} size="small">
      <TableHead>
        <TableRow>
          <TableCell>{t('code')}</TableCell>
          <TableCell>{t('document')}</TableCell>
          <TableCell>{t('type')}</TableCell>
          <TableCell>{t('due')}</TableCell>
          <TableCell align="right">{t('originalAmount')}</TableCell>
          <TableCell align="right">{t('paidAmount')}</TableCell>
          <TableCell align="right">{t('balance')}</TableCell>
          <TableCell>{t('status')}</TableCell>
          <TableCell align="right">{t('actions')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {debts.items.map((debt) => {
          const remainingAmount = Number(debt.originalAmount) - Number(debt.paidAmount);
          const canRecordPayment = debt.status === 'OPEN' || debt.status === 'PARTIAL';

          return (
            <TableRow key={debt.id}>
              <TableCell sx={{ fontWeight: 700 }}>{debt.code}</TableCell>
              <TableCell>{debt.invoiceNo ?? debt.orderNo ?? debt.title}</TableCell>
              <TableCell>{debt.type === 'RECEIVABLE' ? t('receivable') : t('payable')}</TableCell>
              <TableCell>{new Date(debt.dueDate).toLocaleDateString(locale)}</TableCell>
              <TableCell align="right">{formatMoney(debt.originalAmount)}</TableCell>
              <TableCell align="right">{formatMoney(debt.paidAmount)}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {formatMoney(remainingAmount)}
              </TableCell>
              <TableCell>
                <Badge tone={statusTone[debt.status]}>{t(statusKey[debt.status])}</Badge>
              </TableCell>
              <TableCell align="right">
                {canRecordPayment ? (
                  <FormDialog
                    buttonIcon="payments"
                    buttonLabel={t('recordPayment')}
                    buttonSize="small"
                    buttonVariant="secondary"
                    title={t('recordPayment')}
                    description={t('recordPaymentDescription')}
                  >
                    <PaymentForm
                      debtId={debt.id}
                      partyId={debt.partyId}
                      remainingAmount={remainingAmount}
                      type={debt.type}
                      onSuccess={onPaymentRecorded}
                    />
                  </FormDialog>
                ) : (
                  <Typography color="text.secondary" variant="body2">
                    {t('noActionNeeded')}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </AppTable>
  );
}
