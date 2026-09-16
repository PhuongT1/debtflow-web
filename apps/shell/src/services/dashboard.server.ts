import 'server-only';
import { apiServer, toDate, toMoney, type Money } from '@/lib/api/server';

export type DashboardQueueDebt = {
  id: string;
  code: string;
  title: string;
  party: { id: string; name: string };
  remainingAmount: Money;
  dueDate: Date;
  nextFollowUpAt?: Date | null;
};

type DashboardPayment = {
  id: string;
  amount: Money;
  paidAt: Date;
  party: { id: string; name: string };
};

type DebtSummary = { count: number; partyCount: number; remaining: Money };
type TradeMetric = { amount: Money; count: number };
type TradePeriod = {
  sales: TradeMetric;
  purchases: TradeMetric;
  cashIn: TradeMetric;
  cashOut: TradeMetric;
};
export type DashboardTradeSummary = {
  period: TradePeriod & { categorySales: Array<{ category: string; amount: Money }> };
};

type Dashboard = {
  receivable: { original: Money; paid: Money; remaining: Money };
  payable: { original: Money; paid: Money; remaining: Money };
  overdueCount: number;
  recentPayments: DashboardPayment[];
  actionCenter: {
    asOf: string;
    receivable: { outstanding: DebtSummary; overdue: DebtSummary; dueNextSevenDays: DebtSummary };
    payable: { outstanding: DebtSummary; overdue: DebtSummary; dueNextSevenDays: DebtSummary };
    cashFlow: { expectedIn: Money; expectedOut: Money; net: Money };
    queues: {
      collect: DashboardQueueDebt[];
      pay: DashboardQueueDebt[];
      followUp: DashboardQueueDebt[];
    };
    trade: DashboardTradeSummary;
  };
};

type RawSummary = { count?: number; partyCount?: number; remaining?: unknown };
type RawQueueDebt = Omit<DashboardQueueDebt, 'dueDate' | 'nextFollowUpAt' | 'remainingAmount'> & {
  dueDate: unknown;
  nextFollowUpAt?: unknown;
  remainingAmount: unknown;
};
type RawDashboardPayment = Omit<DashboardPayment, 'amount' | 'paidAt'> & {
  amount: unknown;
  paidAt: unknown;
};
type RawDashboard = {
  receivable?: { original?: unknown; paid?: unknown; remaining?: unknown };
  payable?: { original?: unknown; paid?: unknown; remaining?: unknown };
  overdueCount?: number;
  recentPayments?: RawDashboardPayment[];
  actionCenter?: {
    asOf?: string;
    receivable?: { outstanding?: RawSummary; overdue?: RawSummary; dueNextSevenDays?: RawSummary };
    payable?: { outstanding?: RawSummary; overdue?: RawSummary; dueNextSevenDays?: RawSummary };
    cashFlow?: { expectedIn?: unknown; expectedOut?: unknown; net?: unknown };
    queues?: { collect?: RawQueueDebt[]; pay?: RawQueueDebt[]; followUp?: RawQueueDebt[] };
    trade?: {
      period?: {
        categorySales?: Array<{ category?: string; amount?: unknown }>;
        sales?: { amount?: unknown; count?: number };
        purchases?: { amount?: unknown; count?: number };
        cashIn?: { amount?: unknown; count?: number };
        cashOut?: { amount?: unknown; count?: number };
      };
    };
  };
};

function normalizeSummary(summary?: RawSummary): DebtSummary {
  return {
    count: summary?.count ?? 0,
    partyCount: summary?.partyCount ?? 0,
    remaining: toMoney(summary?.remaining),
  };
}

function normalizeTradeMetric(metric?: { amount?: unknown; count?: number }): TradeMetric {
  return { amount: toMoney(metric?.amount), count: metric?.count ?? 0 };
}

type RawTrade = NonNullable<NonNullable<RawDashboard['actionCenter']>['trade']>;

function normalizeTrade(trade?: RawTrade): DashboardTradeSummary {
  return {
    period: {
      categorySales: (trade?.period?.categorySales ?? []).map((item) => ({
        category: item.category ?? 'Uncategorized',
        amount: toMoney(item.amount),
      })),
      sales: normalizeTradeMetric(trade?.period?.sales),
      purchases: normalizeTradeMetric(trade?.period?.purchases),
      cashIn: normalizeTradeMetric(trade?.period?.cashIn),
      cashOut: normalizeTradeMetric(trade?.period?.cashOut),
    },
  };
}

function normalizeQueue(debts: RawQueueDebt[] | undefined): DashboardQueueDebt[] {
  return (debts ?? []).map((debt) => ({
    ...debt,
    dueDate: toDate(debt.dueDate) ?? new Date(),
    nextFollowUpAt: toDate(debt.nextFollowUpAt),
    remainingAmount: toMoney(debt.remainingAmount),
  }));
}

export async function getDashboard(period: { dateFrom: string; dateTo: string }): Promise<Dashboard> {
  const dashboard = await apiServer.get<RawDashboard>('dashboard', { query: period });
  const actionCenter = dashboard.actionCenter;

  return {
    receivable: {
      original: toMoney(dashboard.receivable?.original),
      paid: toMoney(dashboard.receivable?.paid),
      remaining: toMoney(dashboard.receivable?.remaining),
    },
    payable: {
      original: toMoney(dashboard.payable?.original),
      paid: toMoney(dashboard.payable?.paid),
      remaining: toMoney(dashboard.payable?.remaining),
    },
    overdueCount: dashboard.overdueCount ?? 0,
    recentPayments: (dashboard.recentPayments ?? []).map((payment) => ({
      ...payment,
      amount: toMoney(payment.amount),
      paidAt: toDate(payment.paidAt) ?? new Date(),
    })),
    actionCenter: {
      asOf: actionCenter?.asOf ?? '',
      receivable: {
        outstanding: normalizeSummary(actionCenter?.receivable?.outstanding),
        overdue: normalizeSummary(actionCenter?.receivable?.overdue),
        dueNextSevenDays: normalizeSummary(actionCenter?.receivable?.dueNextSevenDays),
      },
      payable: {
        outstanding: normalizeSummary(actionCenter?.payable?.outstanding),
        overdue: normalizeSummary(actionCenter?.payable?.overdue),
        dueNextSevenDays: normalizeSummary(actionCenter?.payable?.dueNextSevenDays),
      },
      cashFlow: {
        expectedIn: toMoney(actionCenter?.cashFlow?.expectedIn),
        expectedOut: toMoney(actionCenter?.cashFlow?.expectedOut),
        net: toMoney(actionCenter?.cashFlow?.net),
      },
      trade: normalizeTrade(actionCenter?.trade),
      queues: {
        collect: normalizeQueue(actionCenter?.queues?.collect),
        pay: normalizeQueue(actionCenter?.queues?.pay),
        followUp: normalizeQueue(actionCenter?.queues?.followUp),
      },
    },
  };
}
