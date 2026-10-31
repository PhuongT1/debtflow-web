import Link from 'next/link';
import { Typography } from '@mui/material';
import { getLocale, getTranslations } from 'next-intl/server';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { StatCard } from '@/components/ui/page/card';
import { MetricGrid, Page, PageGrid, PageHeader } from '@/components/ui/page/page';
import { SectionCard } from '@/components/ui/page/section-card';
import { DashboardActionQueue } from '@/features/dashboard/dashboard-action-queue';
import { getDashboardPeriod } from '@/features/dashboard/dashboard-period';
import { DashboardPeriodFilter } from '@/features/dashboard/dashboard-period-filter';
import { DashboardTradeSummaryCard } from '@/features/dashboard/dashboard-trade-summary';
import { API_URL } from '@/lib/config/environment';
import { formatMoney } from '@/lib/presentation/formatters';
import { getDashboard } from '@/services/dashboard.server';

import type { ActionMetricProps, DashboardPageProps } from './dashboard-page.types';

function ActionMetric({ children, href }: ActionMetricProps) {
  return (
    <Link
      className="block rounded-lg outline-offset-4 focus:outline focus:outline-2 focus:outline-blue-600"
      href={href}
    >
      {children}
    </Link>
  );
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const ui = await getTranslations('Workspace');

  const period = getDashboardPeriod(await searchParams);
  const [dashboard, t, locale] = await Promise.all([
    getDashboard(period),
    getTranslations('Dashboard'),
    getLocale(),
  ]);
  const { actionCenter } = dashboard;
  const asOf = actionCenter.asOf
    ? new Date(actionCenter.asOf + 'T00:00:00+07:00').toLocaleDateString(
        locale === 'en' ? 'en-US' : 'vi-VN',
      )
    : t('today');

  return (
    <Page>
      <PageHeader
        title={t('title')}
        description={t('description', { date: asOf })}
        actions={
          <>
            <HelpModal
              title={ui('useTheDebtCenterEveryDay')}
              description={ui('focusOnTheTasksThatDirectlyAffectYourCash')}
              steps={[
                ui('handleOverdueReceivablesAndAmountsDueTodayFirstTo'),
                ui('checkOverduePayablesToKeepYourSupplierCommitments'),
                ui('reviewThe7DayCashFlowToPlanInventory'),
                ui('openARecordToRecordPaymentOrScheduleA'),
              ]}
              tips={[
                ui('createADebtRecordWithADueDateFor'),
                ui('theRemainingBalanceIsCalculatedFromTheOriginalDebt'),
              ]}
            />
            <Button component={Link} href={API_URL + '/exports/debts'}>
              {t('export')}
            </Button>
          </>
        }
      />

      <DashboardPeriodFilter dateFrom={period.dateFrom} dateTo={period.dateTo} />

      <MetricGrid>
        <ActionMetric href="/debts?type=RECEIVABLE&outstanding=true">
          <StatCard
            hint={t('receivableHint', {
              count: actionCenter.receivable.outstanding.count,
              parties: actionCenter.receivable.outstanding.partyCount,
            })}
            icon="debts"
            label={t('customerOwes')}
            tone="blue"
            value={formatMoney(actionCenter.receivable.outstanding.remaining, locale)}
          />
        </ActionMetric>
        <ActionMetric href="/debts?type=PAYABLE&outstanding=true">
          <StatCard
            hint={t('payableHint', {
              count: actionCenter.payable.outstanding.count,
              parties: actionCenter.payable.outstanding.partyCount,
            })}
            icon="download"
            label={t('youOweSupplier')}
            tone="amber"
            value={formatMoney(actionCenter.payable.outstanding.remaining, locale)}
          />
        </ActionMetric>
        <ActionMetric href="/debts?type=RECEIVABLE&outstanding=true&overdue=true">
          <StatCard
            hint={t('collectNow', { count: actionCenter.receivable.overdue.count })}
            icon="calendar"
            label={t('receivableOverdue')}
            tone="red"
            value={formatMoney(actionCenter.receivable.overdue.remaining, locale)}
          />
        </ActionMetric>
        <ActionMetric href="/debts?type=PAYABLE&outstanding=true&overdue=true">
          <StatCard
            hint={t('payNow', { count: actionCenter.payable.overdue.count })}
            icon="calendar"
            label={t('payableOverdue')}
            tone="red"
            value={formatMoney(actionCenter.payable.overdue.remaining, locale)}
          />
        </ActionMetric>
      </MetricGrid>

      <DashboardTradeSummaryCard
        dateFrom={period.dateFrom}
        dateTo={period.dateTo}
        trade={actionCenter.trade}
      />

      <SectionCard description={t('cashFlowDescription')} title={t('cashFlowTitle')}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            className="rounded-lg bg-emerald-50 p-4 transition hover:bg-emerald-100"
            href="/debts?type=RECEIVABLE&outstanding=true&dueRange=next_7_days"
          >
            <p className="text-sm font-bold text-emerald-800">{t('expectedIn')}</p>
            <p className="mt-2 text-xl font-black text-emerald-950">
              {formatMoney(actionCenter.cashFlow.expectedIn, locale)}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              {t('dueCount', { count: actionCenter.receivable.dueNextSevenDays.count })}
            </p>
          </Link>
          <Link
            className="rounded-lg bg-amber-50 p-4 transition hover:bg-amber-100"
            href="/debts?type=PAYABLE&outstanding=true&dueRange=next_7_days"
          >
            <p className="text-sm font-bold text-amber-800">{t('expectedOut')}</p>
            <p className="mt-2 text-xl font-black text-amber-950">
              {formatMoney(actionCenter.cashFlow.expectedOut, locale)}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              {t('dueCount', { count: actionCenter.payable.dueNextSevenDays.count })}
            </p>
          </Link>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-bold text-slate-700">{t('netCashFlow')}</p>
            <p className="mt-2 text-xl font-black text-slate-950">
              {formatMoney(actionCenter.cashFlow.net, locale)}
            </p>
            <p className="mt-1 text-xs text-slate-600">{t('netDescription')}</p>
          </div>
        </div>
      </SectionCard>

      <PageGrid columns={3}>
        <DashboardActionQueue
          debts={actionCenter.queues.collect}
          description={t('collectDescription')}
          emptyMessage={t('collectEmpty')}
          title={t('collectTitle')}
        />
        <DashboardActionQueue
          debts={actionCenter.queues.pay}
          description={t('payDescription')}
          emptyMessage={t('payEmpty')}
          title={t('payTitle')}
        />
        <DashboardActionQueue
          debts={actionCenter.queues.followUp}
          description={t('followUpDescription')}
          emptyMessage={t('followUpEmpty')}
          title={t('followUpTitle')}
        />
      </PageGrid>

      <SectionCard description={t('recentPaymentsDescription')} title={t('recentPayments')}>
        <div className="grid gap-2.5 md:grid-cols-2">
          {dashboard.recentPayments.length === 0 ? (
            <Typography color="text.secondary" variant="body2">
              {t('noPayments')}
            </Typography>
          ) : (
            dashboard.recentPayments.map((payment) => (
              <Link
                className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 transition hover:border-blue-300 hover:bg-blue-50"
                href={'/debts?partyId=' + payment.party.id}
                key={payment.id}
              >
                <div>
                  <p className="font-semibold text-slate-950">{payment.party.name}</p>
                  <p className="text-sm text-slate-500">
                    {payment.paidAt.toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN')}
                  </p>
                </div>
                <Badge tone="green">{formatMoney(payment.amount, locale)}</Badge>
              </Link>
            ))
          )}
        </div>
      </SectionCard>
    </Page>
  );
}
