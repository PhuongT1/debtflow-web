import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { Typography } from '@mui/material';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/card';
import { HelpModal } from '@/components/ui/help-modal';
import { MetricGrid, Page, PageGrid, PageHeader } from '@/components/ui/page';
import { SectionCard } from '@/components/ui/section-card';
import { DashboardActionQueue } from '@/features/dashboard/dashboard-action-queue';
import { DashboardPeriodFilter } from '@/features/dashboard/dashboard-period-filter';
import { getDashboardPeriod } from '@/features/dashboard/dashboard-period';
import { DashboardTradeSummaryCard } from '@/features/dashboard/dashboard-trade-summary';
import { getDashboard } from '@/services/dashboard.server';
import { API_URL } from '@/lib/config/environment';
import { formatMoney } from '@/lib/presentation/formatters';

function ActionMetric({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      className="block rounded-lg outline-offset-4 focus:outline focus:outline-2 focus:outline-blue-600"
      href={href}
    >
      {children}
    </Link>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const period = getDashboardPeriod(await searchParams);
  const [dashboard, t, locale] = await Promise.all([
    getDashboard(period),
    getTranslations('Dashboard'),
    getLocale(),
  ]);
  const { actionCenter } = dashboard;
  const asOf = actionCenter.asOf
    ? new Date(actionCenter.asOf + 'T00:00:00+07:00').toLocaleDateString(locale === 'en' ? 'en-US' : 'vi-VN')
    : t('today');

  return (
    <Page>
      <PageHeader
        title={t('title')}
        description={t('description', { date: asOf })}
        actions={
          <>
            <HelpModal
              title="Dùng trung tâm công nợ mỗi ngày"
              description="Màn hình này ưu tiên các việc ảnh hưởng trực tiếp đến tiền mặt của shop."
              steps={[
                'Xử lý Phải thu quá hạn và Cần thu hôm nay trước để bảo vệ dòng tiền.',
                'Kiểm tra Phải trả quá hạn để không trễ hẹn với nhà cung cấp.',
                'Xem Dòng tiền 7 ngày để chủ động chuẩn bị tiền nhập hàng.',
                'Mở từng khoản để ghi nhận thanh toán hoặc đặt lịch nhắc khách.',
              ]}
              tips={[
                'Mỗi đơn bán thiếu và mỗi hóa đơn nhập hàng nên tạo một công nợ có ngày đến hạn.',
                'Không dùng tổng tiền ghi tay: số còn lại được tính từ công nợ gốc trừ các lần thanh toán.',
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
            value={formatMoney(actionCenter.receivable.outstanding.remaining)}
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
            value={formatMoney(actionCenter.payable.outstanding.remaining)}
          />
        </ActionMetric>
        <ActionMetric href="/debts?type=RECEIVABLE&outstanding=true&overdue=true">
          <StatCard
            hint={t('collectNow', { count: actionCenter.receivable.overdue.count })}
            icon="calendar"
            label={t('receivableOverdue')}
            tone="red"
            value={formatMoney(actionCenter.receivable.overdue.remaining)}
          />
        </ActionMetric>
        <ActionMetric href="/debts?type=PAYABLE&outstanding=true&overdue=true">
          <StatCard
            hint={t('payNow', { count: actionCenter.payable.overdue.count })}
            icon="calendar"
            label={t('payableOverdue')}
            tone="red"
            value={formatMoney(actionCenter.payable.overdue.remaining)}
          />
        </ActionMetric>
      </MetricGrid>

      <DashboardTradeSummaryCard
        dateFrom={period.dateFrom}
        dateTo={period.dateTo}
        trade={actionCenter.trade}
      />

      <SectionCard
        description={t('cashFlowDescription')}
        title={t('cashFlowTitle')}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            className="rounded-lg bg-emerald-50 p-4 transition hover:bg-emerald-100"
            href="/debts?type=RECEIVABLE&outstanding=true&dueRange=next_7_days"
          >
            <p className="text-sm font-bold text-emerald-800">{t('expectedIn')}</p>
            <p className="mt-2 text-xl font-black text-emerald-950">
              {formatMoney(actionCenter.cashFlow.expectedIn)}
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
              {formatMoney(actionCenter.cashFlow.expectedOut)}
            </p>
            <p className="mt-1 text-xs text-amber-700">
              {t('dueCount', { count: actionCenter.payable.dueNextSevenDays.count })}
            </p>
          </Link>
          <div className="rounded-lg bg-slate-100 p-4">
            <p className="text-sm font-bold text-slate-700">{t('netCashFlow')}</p>
            <p className="mt-2 text-xl font-black text-slate-950">
              {formatMoney(actionCenter.cashFlow.net)}
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

      <SectionCard
        description={t('recentPaymentsDescription')}
        title={t('recentPayments')}
      >
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
                <Badge tone="green">{formatMoney(payment.amount)}</Badge>
              </Link>
            ))
          )}
        </div>
      </SectionCard>
    </Page>
  );
}
