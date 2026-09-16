import 'server-only';
import { apiServer, toDate, toMoney, type Money } from '@/lib/api/server';
import { partyQuerySchema } from '@/features/parties/model/party.schema';

type UserSummary = { id: string; name: string; email: string };

export type Party = {
  id: string;
  type: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
  code?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  taxCode?: string | null;
  address?: string | null;
  note?: string | null;
  creditLimit?: Money | null;
  assignedToId?: string | null;
  assignedTo?: UserSummary | null;
  createdAt: Date;
  debts?: Array<{
    id: string;
    code: string;
    type: 'RECEIVABLE' | 'PAYABLE';
    invoiceNo?: string | null;
    orderNo?: string | null;
    contractNo?: string | null;
    poNo?: string | null;
    originalAmount: Money;
    paidAmount: Money;
    dueDate: Date;
    status: 'OPEN' | 'PARTIAL' | 'PAID' | 'CANCELLED';
    collectionStatus: 'NEW' | 'CONTACTED' | 'PROMISED' | 'DISPUTED' | 'ESCALATED';
    nextFollowUpAt?: Date | null;
  }>;
  balance?: { receivable: Money; payable: Money };
  _count: { debts: number };
};

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

type PartyDebt = NonNullable<Party['debts']>[number];
type RawPartyDebt = Omit<
  PartyDebt,
  'originalAmount' | 'paidAmount' | 'dueDate' | 'nextFollowUpAt'
> & {
  originalAmount: unknown;
  paidAmount: unknown;
  dueDate: unknown;
  nextFollowUpAt?: unknown;
};
type RawParty = Omit<Party, 'creditLimit' | 'createdAt' | 'debts' | '_count'> & {
  creditLimit?: unknown;
  createdAt: unknown;
  debts?: RawPartyDebt[];
  balance?: { receivable?: unknown; payable?: unknown };
  _count?: { debts: number };
};

function normalizeParty(raw: RawParty): Party {
  return {
    ...raw,
    creditLimit: raw.creditLimit == null ? null : toMoney(raw.creditLimit),
    createdAt: toDate(raw.createdAt) ?? new Date(),
    debts: raw.debts?.map((debt) => ({
      ...debt,
      originalAmount: toMoney(debt.originalAmount),
      paidAmount: toMoney(debt.paidAmount),
      dueDate: toDate(debt.dueDate) ?? new Date(),
      nextFollowUpAt: toDate(debt.nextFollowUpAt),
    })),
    balance: raw.balance ? { receivable: toMoney(raw.balance.receivable), payable: toMoney(raw.balance.payable) } : undefined,
    _count: raw._count ?? { debts: raw.debts?.length ?? 0 },
  };
}

export async function listParties(input: unknown) {
  const query = partyQuerySchema.parse(input);
  const result = await apiServer.get<Paginated<RawParty>>('parties', { query });

  return {
    ...result,
    items: result.items.map(normalizeParty),
  };
}
