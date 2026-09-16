import Link from 'next/link';
import { Box } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmActionButton } from '@/components/ui/confirm-action-button';
import type { DataTableColumn } from '@/components/ui/data-table';
import type { Debt } from '@/services/debt.server';
import { formatMoney } from '@/lib/presentation/formatters';
import { CollectionStatus, DebtStatus, type DebtType } from '@/lib/domain/enums';

type Translate = (key: string, values?: Record<string, string | number | Date>) => string;

const statusTone: Record<DebtStatus, 'slate' | 'blue' | 'amber' | 'green' | 'red'> = {
  OPEN: 'blue',
  PARTIAL: 'amber',
  PAID: 'green',
  CANCELLED: 'red',
};

export function getDebtListColumns(t: Translate): Array<DataTableColumn<Debt>> {
  const debtTypeLabels: Record<DebtType, string> = {
    RECEIVABLE: t('receivable'),
    PAYABLE: t('payable'),
  };
  const collectionStatusLabels: Record<CollectionStatus, string> = {
    NEW: t('new'),
    CONTACTED: t('contacted'),
    PROMISED: t('promised'),
    DISPUTED: t('disputed'),
    ESCALATED: t('escalated'),
  };
  const statusLabels: Record<DebtStatus, string> = {
    OPEN: t('open'),
    PARTIAL: t('partial'),
    PAID: t('paid'),
    CANCELLED: t('cancelled'),
  };

  return [
    {
      key: 'code',
      header: t('code'),
      render: (debt) => (
        <div>
          <Link className="font-semibold text-blue-600" href={`/debts/${debt.id}`}>
            {debt.code}
          </Link>
          <div className="mt-1">
            <Badge tone={statusTone[debt.status]}>{statusLabels[debt.status]}</Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'party',
      header: t('partner'),
      render: (debt) => (
        <a className="font-semibold text-slate-900" href={`/parties/${debt.partyId}`}>
          {debt.party.name}
        </a>
      ),
    },
    {
      key: 'document',
      header: t('document'),
      render: (debt) => (
        <div>
          <p>{debt.invoiceNo ?? debt.orderNo ?? '-'}</p>
          <p className="text-xs text-slate-500">{debt.contractNo ?? debt.poNo ?? ''}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: t('goods'),
      render: (debt) =>
        debt.items?.length ? (
          <div>
            <p className="font-medium">{debt.items[0].productName}</p>
            <p className="text-xs text-slate-500">
              {[debt.items[0].brandName, debt.items[0].categoryName].filter(Boolean).join(' · ')}
              {debt.items.length > 1
                ? ' · ' + t('moreItems', { count: debt.items.length - 1 })
                : ''}
            </p>
          </div>
        ) : (
          '-'
        ),
    },
    { key: 'sale', header: t('owner'), render: (debt) => debt.assignedTo?.name ?? '-' },
    { key: 'type', header: t('type'), render: (debt) => debtTypeLabels[debt.type] },
    {
      key: 'remaining',
      header: t('balance'),
      align: 'right',
      render: (debt) => (
        <span className="font-semibold">
          {formatMoney(debt.originalAmount.minus(debt.paidAmount))}
        </span>
      ),
    },
    {
      key: 'dueDate',
      header: t('due'),
      render: (debt) => {
        const lateDays = Math.floor((Date.now() - debt.dueDate.getTime()) / 86_400_000);
        return (
          <div>
            <p>{debt.dueDate.toLocaleDateString()}</p>
            {lateDays > 0 && debt.status !== DebtStatus.PAID ? (
              <p className="text-xs font-semibold text-red-600">
                {t('lateDays', { days: lateDays })}
              </p>
            ) : null}
          </div>
        );
      },
    },
    {
      key: 'collection',
      header: t('collection'),
      render: (debt) => (
        <div>
          <Badge
            tone={
              debt.collectionStatus === 'ESCALATED' || debt.collectionStatus === 'DISPUTED'
                ? 'red'
                : debt.collectionStatus === 'PROMISED'
                  ? 'amber'
                  : 'slate'
            }
          >
            {collectionStatusLabels[debt.collectionStatus]}
          </Badge>
          {debt.nextFollowUpAt ? (
            <p className="mt-1 text-xs text-slate-500">
              {t('followUpOn', { date: debt.nextFollowUpAt.toLocaleDateString() })}
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'actions',
      header: t('actions'),
      render: (debt) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Button component={Link} href={`/debts/${debt.id}`} variant="secondary">
            {t('detailsCollect')}
          </Button>
          <ConfirmActionButton
            confirmMessage={t('cancelConfirm')}
            endpoint={`/api/debts/${debt.id}`}
            label={t('cancel')}
          />
        </Box>
      ),
    },
  ];
}
