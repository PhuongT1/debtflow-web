import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

import { DataTable, type DataTableColumn } from '@/components/tables';
import { applyTableLayout } from '@/components/tables/page-layouts';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { StatCard } from '@/components/ui/page/card';
import { MetricGrid, Page, PageHeader } from '@/components/ui/page/page';
import { formatMoney } from '@/lib/presentation/formatters';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';
import { getDebtAgingReport, listDebts } from '@/services/debt.server';

import type { AgingReportPageProps } from './aging-report-page.types';

export async function AgingReportPage({ searchParams }: AgingReportPageProps) {
  const locale = await getLocale();

  const ui = await getTranslations('Workspace');

  const filters = await searchParams;
  const [aging, debts] = await Promise.all([
    getDebtAgingReport({ type: 'RECEIVABLE' }),
    listDebts({ ...filters, type: 'RECEIVABLE' }),
  ]);
  const activeDebts = debts.items.filter(
    (debt) => debt.status !== 'PAID' && debt.status !== 'CANCELLED',
  );
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
    { key: 'party', title: ui('customer'), render: (debt) => debt.party.name },
    { key: 'sale', title: 'Sale', render: (debt) => debt.assignedTo?.name ?? '-' },
    {
      key: 'remaining',
      title: ui('remaining'),
      align: 'right',
      render: (debt) => (
        <span className="font-semibold">
          {formatMoney(debt.originalAmount.minus(debt.paidAmount), locale)}
        </span>
      ),
    },
    {
      key: 'dueDate',
      title: ui('dueText'),
      render: (debt) => debt.dueDate.toLocaleDateString(locale),
    },
    {
      key: 'late',
      title: ui('overdue'),
      render: (debt) => {
        const lateDays = Math.max(0, Math.floor((Date.now() - debt.dueDate.getTime()) / 86400000));
        return (
          <span className={lateDays > 0 ? 'font-semibold text-red-600' : 'text-slate-500'}>
            {lateDays > 0 ? ui('daysCount', { value1: lateDays }) : ui('notYetDue')}
          </span>
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
        title={ui('debtAgingReport')}
        description={ui('seeWhichDebtsAreRecentlyOverdueAndWhichNeed')}
        actions={
          <HelpModal
            title={ui('howToReadTheAgingReport')}
            description={ui('agingShowsHowLongFundsHaveBeenOutstandingPrioritize')}
            steps={[
              ui('reviewNotYetDueForUpcomingPayments'),
              ui('followUpOnDebtsOverdueBy17Days'),
              ui('reviewDebtsOverdueBy3160OrOver60'),
              ui('openADebtCodeToWorkOnThatRecord'),
            ]}
            tips={[ui('useThisScreenInsteadOfManuallyColorCodingAn')]}
          />
        }
      />

      <MetricGrid columns={5}>
        {Object.values(aging).map((bucket) => (
          <StatCard
            icon="aging"
            key={bucket.label}
            label={ui(bucket.label)}
            value={formatMoney(bucket.amount, locale)}
            hint={ui('debtsCount', { value1: bucket.count })}
          />
        ))}
      </MetricGrid>

      <DataTable
        title={ui('receivableDetails')}
        columns={applyTableLayout(columns, 'aging')}
        tableSx={{ tableLayout: 'fixed' }}
        emptyMessage={ui('noOutstandingReceivables')}
        fillHeight
        hrefForPage={(page) => hrefWithPage('/reports/aging', filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize('/reports/aging', filters, pageSize)}
        paginationMeta={debts}
        rowKey="id"
        dataSource={activeDebts}
      />
    </Page>
  );
}
