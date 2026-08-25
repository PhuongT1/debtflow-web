import { apiGet, toDate, toMoney, type Money } from "@/lib/server-api";

type DashboardDebt = {
  id: string;
  code: string;
  party: { id: string; name: string };
  originalAmount: Money;
  paidAmount: Money;
  dueDate: Date;
};

type DashboardPayment = {
  id: string;
  amount: Money;
  paidAt: Date;
  debt: {
    id: string;
    party: { id: string; name: string };
  };
};

type Dashboard = {
  receivable: {
    original: Money;
    paid: Money;
    remaining: Money;
  };
  payable: {
    original: Money;
    paid: Money;
    remaining: Money;
  };
  overdueCount: number;
  topDebts: DashboardDebt[];
  recentPayments: DashboardPayment[];
};

type RawDashboardDebt = Omit<DashboardDebt, "originalAmount" | "paidAmount" | "dueDate"> & {
  originalAmount: unknown;
  paidAmount: unknown;
  dueDate: unknown;
};

type RawDashboardPayment = Omit<DashboardPayment, "amount" | "paidAt"> & {
  amount: unknown;
  paidAt: unknown;
};

type RawDashboard = Omit<Dashboard, "receivable" | "payable" | "topDebts" | "recentPayments"> & {
  receivable?: { original?: unknown; paid?: unknown; remaining?: unknown };
  payable?: { original?: unknown; paid?: unknown; remaining?: unknown };
  topDebts?: RawDashboardDebt[];
  recentPayments?: RawDashboardPayment[];
};

export async function getDashboard(): Promise<Dashboard> {
  const dashboard = await apiGet<RawDashboard>("dashboard");

  return {
    ...dashboard,
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
    topDebts: (dashboard.topDebts ?? []).map((debt) => ({
      ...debt,
      originalAmount: toMoney(debt.originalAmount),
      paidAmount: toMoney(debt.paidAmount),
      dueDate: toDate(debt.dueDate) ?? new Date(),
    })),
    recentPayments: (dashboard.recentPayments ?? []).map((payment) => ({
      ...payment,
      amount: toMoney(payment.amount),
      paidAt: toDate(payment.paidAt) ?? new Date(),
    })),
  };
}
