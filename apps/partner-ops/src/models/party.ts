import type { DebtStatus, DebtType, PartyType } from '@/lib/domain';

import type { UserSummary } from './user';

export type Party = {
  id: string;
  type: PartyType;
  code?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  taxCode?: string | null;
  address?: string | null;
  provinceCode?: string | null;
  provinceName?: string | null;
  note?: string | null;
  creditLimit?: string | number | null;
  assignedToId?: string | null;
  assignedTo?: UserSummary | null;
  createdAt: string;
  _count: { debts: number };
  balance: { receivable: string | number; payable: string | number };
};

export type PartyDebt = {
  id: string;
  code: string;
  type: DebtType;
  status: DebtStatus;
  originalAmount: string | number;
  paidAmount: string | number;
  invoiceNo?: string | null;
  orderNo?: string | null;
  contractNo?: string | null;
  dueDate: string;
  collectionStatus?: string | null;
};
