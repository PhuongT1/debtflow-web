import { getLocale, getTranslations } from 'next-intl/server';

import { DataTable, type DataTableColumn } from '@/components/tables';
import { Badge } from '@/components/ui/badge';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { StatCard } from '@/components/ui/page/card';
import { DetailList } from '@/components/ui/page/detail-list';
import { MetricGrid, Page, PageHeader, PageSplit } from '@/components/ui/page/page';
import { SectionCard } from '@/components/ui/page/section-card';
import { CollectionForm } from '@/features/debts/forms/collection-form';
import { PaymentForm } from '@/features/payments';
import { formatMoney } from '@/lib/presentation/formatters';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';
import { getDebt } from '@/services/debt.server';
import { listUserOptions } from '@/services/user.server';

import type { DebtDetailPageProps } from './debt-detail-page.types';
import { DebtItems } from './debt-items';

export type Params = { params: Promise<{ id: string }> };

export default async function DebtDetailPage({ params, searchParams }: DebtDetailPageProps) {
  const locale = await getLocale();

  const ui = await getTranslations('Workspace');

  const filters = await searchParams;
  const page = Math.max(1, Number(filters.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(filters.pageSize ?? 20)));
  const [debt, users] = await Promise.all([getDebt((await params).id), listUserOptions()]);
  const activeUsers = users
    .filter((user) => user.status === 'ACTIVE')
    .sort((a, b) => a.name.localeCompare(b.name));
  const remaining = debt.originalAmount.minus(debt.paidAmount);
  const isOverdue =
    debt.dueDate < new Date() && remaining.greaterThan(0) && debt.status !== 'CANCELLED';
  const payments = debt.payments ?? [];
  const pagedPayments = payments.slice((page - 1) * pageSize, page * pageSize);
  const paymentColumns: Array<DataTableColumn<(typeof payments)[number]>> = [
    {
      key: 'paidAt',
      title: ui('date'),
      render: (payment) => payment.paidAt.toLocaleDateString(locale),
    },
    {
      key: 'amount',
      title: ui('amount'),
      align: 'right',
      render: (payment) => (
        <span className="font-semibold">{formatMoney(payment.amount, locale)}</span>
      ),
    },
    { key: 'method', title: ui('method'), render: (payment) => payment.method },
    { key: 'referenceNo', title: ui('reference'), render: (payment) => payment.referenceNo ?? '-' },
    {
      key: 'createdBy',
      title: ui('recordedBy'),
      render: (payment) => payment.createdBy?.name ?? '-',
    },
    {
      key: 'actions',
      title: ui('actions'),
      render: (payment) => (
        <ConfirmActionButton
          endpoint={`/api/payments/${payment.id}`}
          confirmMessage={ui('deleteThisPaymentTheDebtBalanceWillBeRecalculated')}
        />
      ),
    },
  ];

  return (
    <Page>
      <PageHeader
        actions={
          <HelpModal
            title={ui('howToManageADebtRecord')}
            description={ui('recordCustomerPaymentsAndScheduleRemindersForThisDebt')}
            steps={[
              ui('checkTheRemainingBalanceToSeeWhatIsStill'),
              ui('recordAPaymentWhenTheCustomerPaysTheBalance'),
              ui('ifTheCustomerHasNotPaidUpdateTheCollection'),
              ui('recordPaymentPromisesAndDisputesInTheCollectionNotes'),
            ]}
            tips={[
              ui('keepTheOriginalAmountRecordEachPaymentSeparately'),
              ui('whenTheRemainingBalanceReachesZeroTheDebtBecomes'),
            ]}
          />
        }
        badge={
          <Badge tone={isOverdue ? 'red' : debt.status === 'PAID' ? 'green' : 'blue'}>
            {isOverdue ? 'OVERDUE' : debt.status}
          </Badge>
        }
        description={debt.title}
        parent={ui('debts')}
        parentHref="/debts"
        title={debt.code}
      />

      <MetricGrid>
        <StatCard
          icon="debts"
          label={ui('totalDebt')}
          value={formatMoney(debt.originalAmount, locale)}
        />
        <StatCard
          icon="payments"
          label={ui('paid')}
          value={formatMoney(debt.paidAmount, locale)}
          tone="green"
        />
        <StatCard
          icon="aging"
          label={ui('remaining')}
          value={formatMoney(remaining, locale)}
          tone="amber"
        />
        <StatCard
          icon="calendar"
          label={ui('dueDate')}
          value={debt.dueDate.toLocaleDateString(locale)}
          tone={isOverdue ? 'red' : 'blue'}
        />
      </MetricGrid>

      <PageSplit
        aside={
          <SectionCard
            title={ui('recordPayment')}
            description={ui('automaticallyAllocateAcrossThisPartnerSInvoicesByDue')}
          >
            <PaymentForm
              debtId={debt.id}
              partyId={debt.partyId}
              remainingAmount={Number(remaining)}
              type={debt.type}
            />
          </SectionCard>
        }
        asideWidth={420}
      >
        <SectionCard
          title={ui('debtInformation')}
          description={ui('documentsOwnerAndFollowUpSchedule')}
        >
          <DetailList
            columns={2}
            items={[
              { label: ui('partners'), value: debt.party.name },
              { label: ui('accountOwner'), value: debt.assignedTo?.name },
              {
                label: ui('documents'),
                value: [debt.invoiceNo, debt.orderNo, debt.contractNo, debt.poNo]
                  .filter(Boolean)
                  .join(' · '),
              },
              { label: ui('collectionStatus'), value: debt.collectionStatus },
              { label: ui('followUp'), value: debt.nextFollowUpAt?.toLocaleDateString(locale) },
              {
                label: ui('type'),
                value: debt.type === 'RECEIVABLE' ? ui('receivable') : ui('payable'),
              },
              { label: ui('issueDate'), value: debt.issueDate.toLocaleDateString(locale) },
              { label: ui('collectionNotes'), value: debt.followUpNote },
              { label: ui('description'), value: debt.description },
            ]}
          />
        </SectionCard>
      </PageSplit>

      <DebtItems items={debt.items} />

      <SectionCard
        title={ui('updateCollectionFollowUp')}
        description={ui('manageStatusAndTheNextReminder')}
      >
        <CollectionForm
          debtId={debt.id}
          users={activeUsers}
          defaults={{
            assignedToId: debt.assignedToId,
            collectionStatus: debt.collectionStatus,
            nextFollowUpAt: debt.nextFollowUpAt,
            followUpNote: debt.followUpNote,
            invoiceNo: debt.invoiceNo,
            orderNo: debt.orderNo,
            contractNo: debt.contractNo,
            poNo: debt.poNo,
          }}
        />
      </SectionCard>

      <DataTable
        title={ui('paymentHistory')}
        columns={paymentColumns}
        emptyMessage={ui('noPaymentsRecordedForThisDebt')}
        hrefForPage={(nextPage) => hrefWithPage(`/debts/${debt.id}`, filters, nextPage)}
        hrefForPageSize={(pageSize) => hrefWithPageSize(`/debts/${debt.id}`, filters, pageSize)}
        paginationMeta={{ page, pageSize, total: payments.length }}
        rowKey="id"
        dataSource={pagedPayments}
      />
    </Page>
  );
}
