'use client';

import { Box, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DataTableCell, DataTableContainer } from '@debtflow/react-ui';
import { Badge } from '@/components/ui/badge';
import { TruncatedText } from '@/components/ui/clamped-text';
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
    <DataTableContainer
      bordered={false}
      containerSx={{ bgcolor: 'background.paper' }}
      fillAvailable
      scroll={{ x: 1470 }}
      size="small"
      sx={{ bgcolor: 'background.paper', tableLayout: 'fixed' }}
    >
      <TableHead>
        <TableRow>
          <TableCell sx={{ width: 150 }}>{t('code')}</TableCell>
          <TableCell sx={{ width: 250 }}>{t('document')}</TableCell>
          <TableCell sx={{ width: 100 }}>{t('type')}</TableCell>
          <TableCell sx={{ width: 120 }}>{t('due')}</TableCell>
          <TableCell align="right" sx={{ width: 160 }}>
            {t('originalAmount')}
          </TableCell>
          <TableCell align="right" sx={{ width: 160 }}>
            {t('paidAmount')}
          </TableCell>
          <TableCell align="right" sx={{ width: 160 }}>
            {t('balance')}
          </TableCell>
          <TableCell sx={{ width: 150 }}>{t('status')}</TableCell>
          <DataTableCell align="right" fixed="right" sx={{ width: 220 }}>
            {t('actions')}
          </DataTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {debts.items.map((debt) => {
          const remainingAmount = Number(debt.originalAmount) - Number(debt.paidAmount);
          const canRecordPayment = debt.status === 'OPEN' || debt.status === 'PARTIAL';

          return (
            <TableRow key={debt.id}>
              <TableCell sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{debt.code}</TableCell>
              <TableCell>
                <TruncatedText title={debt.invoiceNo ?? debt.orderNo ?? debt.title}>
                  {debt.invoiceNo ?? debt.orderNo ?? debt.title}
                </TruncatedText>
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {debt.type === 'RECEIVABLE' ? t('receivable') : t('payable')}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                {new Date(debt.dueDate).toLocaleDateString(locale)}
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                {formatMoney(debt.originalAmount)}
              </TableCell>
              <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                {formatMoney(debt.paidAmount)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {formatMoney(remainingAmount)}
              </TableCell>
              <TableCell sx={{ whiteSpace: 'nowrap' }}>
                <Badge tone={statusTone[debt.status]}>{t(statusKey[debt.status])}</Badge>
              </TableCell>
              <DataTableCell align="right" fixed="right" sx={{ whiteSpace: 'nowrap', width: 220 }}>
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
              </DataTableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </DataTableContainer>
  );
}
