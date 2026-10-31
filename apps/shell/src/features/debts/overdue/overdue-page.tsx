import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

import { DataTable, type DataTableColumn } from '@/components/tables';
import { applyTableLayout } from '@/components/tables/page-layouts';
import { Badge } from '@/components/ui/badge';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { Page, PageHeader } from '@/components/ui/page/page';
import { formatMoney } from '@/lib/presentation/formatters';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';
import { listDebts } from '@/services/debt.server';

import type { OverduePageProps } from './overdue-page.types';

export async function OverduePage({ searchParams }: OverduePageProps) {
  const locale = await getLocale();

  const ui = await getTranslations('Workspace');

  const filters = await searchParams;
  const debts = await listDebts({ ...filters, overdue: true });
  const columns: Array<DataTableColumn<(typeof debts.items)[number]>> = [
    {
      key: 'code',
      title: ui('code'),
      render: (debt) => (
        <Link className="font-semibold text-blue-600" href={`/debts/${debt.id}`}>
          {debt.code}
        </Link>
      ),
    },
    { key: 'party', title: ui('partners'), render: (debt) => debt.party.name },
    {
      key: 'type',
      title: ui('type'),
      render: (debt) => (debt.type === 'RECEIVABLE' ? ui('receivable') : ui('payable')),
    },
    {
      key: 'remaining',
      title: ui('remaining'),
      align: 'right',
      render: (debt) => formatMoney(debt.originalAmount.minus(debt.paidAmount), locale),
    },
    {
      key: 'dueDate',
      title: ui('dueDate'),
      render: (debt) => debt.dueDate.toLocaleDateString(locale),
    },
    {
      key: 'late',
      title: ui('overdue'),
      render: (debt) => {
        const lateDays = Math.max(1, Math.ceil((Date.now() - debt.dueDate.getTime()) / 86400000));
        return (
          <Badge tone="red">
            {lateDays} {ui('days')}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      title: ui('actions'),
      render: (debt) => (
        <ConfirmActionButton
          endpoint={`/api/debts/${debt.id}`}
          label={ui('cancel')}
          confirmMessage={ui('cancelThisDebtDebtsWithRecordedPaymentsCannotBe')}
        />
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader
        title={ui('overdueDebts')}
        description={ui('overdueRecordsWithAnOutstandingBalance')}
        actions={
          <HelpModal
            title={ui('howToHandleOverdueDebts')}
            description={ui('startHereWhenFollowingUpOnUnpaidAmounts')}
            steps={[
              ui('prioritizeTheOldestDebtsAndLargestOutstandingBalances'),
              ui('openADebtCodeToReviewPartnerDetailsAnd'),
              ui('callTheCustomerThenUpdateTheCollectionStatusContacted'),
              ui('setAFollowUpDateSoYouRememberTo'),
            ]}
            tips={[
              ui('thisListExcludesPaidAndCancelledDebts'),
              ui('theSystemCalculatesOverdueDaysForYou'),
            ]}
          />
        }
      />

      <DataTable
        columns={applyTableLayout(columns, 'overdue')}
        tableSx={{ tableLayout: 'fixed' }}
        emptyMessage={ui('noOverdueDebts')}
        fillHeight
        hrefForPage={(page) => hrefWithPage('/overdue', filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize('/overdue', filters, pageSize)}
        paginationMeta={debts}
        rowKey="id"
        dataSource={debts.items}
      />
    </Page>
  );
}
