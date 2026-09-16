import { getTranslations } from 'next-intl/server';
import { SectionCard } from '@/components/ui/section-card';
import type { DashboardTradeSummary } from '@/services/dashboard.server';
import { formatMoney } from '@/lib/presentation/formatters';

type DashboardTradeSummaryCardProps = {
  dateFrom: string;
  dateTo: string;
  trade: DashboardTradeSummary;
};

export async function DashboardTradeSummaryCard({
  dateFrom,
  dateTo,
  trade,
}: DashboardTradeSummaryCardProps) {
  const t = await getTranslations('Dashboard');
  const period = trade.period;

  return (
    <SectionCard
      description={t('tradeDescription', { dateFrom, dateTo })}
      title={t('tradeTitle')}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <TradeMetric amount={period.sales.amount} count={period.sales.count} label={t('creditSales')} tone="blue" unit={t('documents')} />
        <TradeMetric amount={period.cashIn.amount} count={period.cashIn.count} label={t('collected')} tone="green" unit={t('receipts')} />
        <TradeMetric amount={period.purchases.amount} count={period.purchases.count} label={t('purchases')} tone="amber" unit={t('purchaseDocuments')} />
        <TradeMetric amount={period.cashOut.amount} count={period.cashOut.count} label={t('paidSuppliers')} tone="red" unit={t('payments')} />
      </div>
      <p className="mt-3 text-sm text-slate-600">
        {t('periodSummary', {
          sales: formatMoney(period.sales.amount),
          purchases: formatMoney(period.purchases.amount),
          cashIn: formatMoney(period.cashIn.amount),
          cashOut: formatMoney(period.cashOut.amount),
        })}
      </p>
      {period.categorySales.length > 0 ? (
        <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-5">
          {period.categorySales.map((item) => (
            <div className="rounded-lg bg-slate-50 p-3" key={item.category}>
              <p className="text-xs font-bold text-slate-600">{item.category}</p>
              <p className="mt-1 text-base font-black text-slate-950">{formatMoney(item.amount)}</p>
              <p className="text-xs text-slate-500">{t('creditSalesInPeriod')}</p>
            </div>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}

function TradeMetric({
  amount,
  count,
  label,
  tone,
  unit,
}: {
  amount: Parameters<typeof formatMoney>[0];
  count: number;
  label: string;
  tone: 'amber' | 'blue' | 'green' | 'red';
  unit: string;
}) {
  const classes = {
    amber: 'bg-amber-50 text-amber-950',
    blue: 'bg-blue-50 text-blue-950',
    green: 'bg-emerald-50 text-emerald-950',
    red: 'bg-rose-50 text-rose-950',
  };

  return (
    <div className={'rounded-lg p-4 ' + classes[tone]}>
      <p className="text-sm font-bold">{label}</p>
      <p className="mt-2 text-xl font-black">{formatMoney(amount)}</p>
      <p className="mt-1 text-xs opacity-75">{count} {unit}</p>
    </div>
  );
}
