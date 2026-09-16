import 'server-only';
import { DebtStatus } from '@/lib/domain/enums';
import { apiServer, toDate, toMoney, type Money } from '@/lib/api/server';
import { debtQuerySchema } from '@/features/debts/model/debt.schema';

type UserSummary = { id: string; name: string; email: string };
type PartySummary = { id: string; name: string };

export type DebtItem = {
  id: string;
  productName: string;
  categoryName?: string | null;
  brandName?: string | null;
  quantity: Money;
  unit: string;
  lineAmount: Money;
};

export type Debt = {
  id: string;
  code: string;
  type: 'RECEIVABLE' | 'PAYABLE';
  partyId: string;
  party: PartySummary;
  assignedToId?: string | null;
  assignedTo?: UserSummary | null;
  title: string;
  invoiceNo?: string | null;
  orderNo?: string | null;
  contractNo?: string | null;
  poNo?: string | null;
  description?: string | null;
  originalAmount: Money;
  paidAmount: Money;
  issueDate: Date;
  dueDate: Date;
  status: 'OPEN' | 'PARTIAL' | 'PAID' | 'CANCELLED';
  collectionStatus: 'NEW' | 'CONTACTED' | 'PROMISED' | 'DISPUTED' | 'ESCALATED';
  nextFollowUpAt?: Date | null;
  followUpNote?: string | null;
  payments?: Payment[];
  items?: DebtItem[];
  _count?: { payments: number };
};

type Payment = {
  id: string;
  amount: Money;
  paidAt: Date;
  method: 'CASH' | 'BANK_TRANSFER' | 'OTHER';
  referenceNo?: string | null;
  note?: string | null;
  createdBy?: UserSummary | null;
};

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

type RawPayment = Omit<Payment, 'amount' | 'paidAt'> & {
  amount: unknown;
  paidAt: unknown;
};
type RawDebt = Omit<
  Debt,
  | 'originalAmount'
  | 'paidAmount'
  | 'issueDate'
  | 'dueDate'
  | 'nextFollowUpAt'
  | 'payments'
  | 'items'
> & {
  originalAmount: unknown;
  paidAmount: unknown;
  issueDate: unknown;
  dueDate: unknown;
  nextFollowUpAt?: unknown;
  payments?: RawPayment[];
  items?: Array<
    Omit<DebtItem, 'quantity' | 'lineAmount'> & { quantity: unknown; lineAmount: unknown }
  >;
};

function normalizeDebt(raw: RawDebt): Debt {
  return {
    ...raw,
    originalAmount: toMoney(raw.originalAmount),
    paidAmount: toMoney(raw.paidAmount),
    issueDate: toDate(raw.issueDate) ?? new Date(),
    dueDate: toDate(raw.dueDate) ?? new Date(),
    nextFollowUpAt: toDate(raw.nextFollowUpAt),
    items: raw.items?.map((item) => ({
      ...item,
      quantity: toMoney(item.quantity),
      lineAmount: toMoney(item.lineAmount),
    })),
    payments: raw.payments?.map((payment) => ({
      ...payment,
      amount: toMoney(payment.amount),
      paidAt: toDate(payment.paidAt) ?? new Date(),
    })),
  };
}

export async function listDebts(input: unknown) {
  const query = debtQuerySchema.parse(input);
  const result = await apiServer.get<Paginated<RawDebt>>('debts', { query });

  return {
    ...result,
    items: result.items.map(normalizeDebt),
  };
}

export async function getDebt(id: string) {
  return normalizeDebt(await apiServer.get<RawDebt>(`debts/${id}`));
}

export async function getDebtAgingReport(input: Record<string, unknown> = {}) {
  const debts = await listDebts({ ...input, page: 1, pageSize: 1000 });
  const now = new Date();
  const buckets = {
    notDue: { label: 'Chưa đến hạn', amount: toMoney(0), count: 0 },
    day1To7: { label: 'Quá hạn 1-7 ngày', amount: toMoney(0), count: 0 },
    day8To30: { label: 'Quá hạn 8-30 ngày', amount: toMoney(0), count: 0 },
    day31To60: { label: 'Quá hạn 31-60 ngày', amount: toMoney(0), count: 0 },
    day60Plus: { label: 'Quá hạn trên 60 ngày', amount: toMoney(0), count: 0 },
  };

  debts.items
    .filter((debt) => debt.status !== DebtStatus.PAID && debt.status !== DebtStatus.CANCELLED)
    .forEach((debt) => {
      const remaining = debt.originalAmount.minus(debt.paidAmount);
      const lateDays = Math.floor((now.getTime() - debt.dueDate.getTime()) / 86400000);
      const bucket =
        lateDays <= 0
          ? buckets.notDue
          : lateDays <= 7
            ? buckets.day1To7
            : lateDays <= 30
              ? buckets.day8To30
              : lateDays <= 60
                ? buckets.day31To60
                : buckets.day60Plus;

      bucket.amount = bucket.amount.plus(remaining);
      bucket.count += 1;
    });

  return buckets;
}
