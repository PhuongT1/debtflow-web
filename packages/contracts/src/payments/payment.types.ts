import type { AuthUser } from '../auth/user.types';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'OTHER';

export interface PaymentDebtSummary {
  id: string;
  code: string;
  originalAmount: string | number;
  paidAmount: string | number;
  party: { id: string; name: string };
}

export interface PaymentAllocationRecord {
  id: string;
  amount: string | number;
  debt: PaymentDebtSummary;
}

export interface PaymentRecord {
  id: string;
  partyId: string;
  type: 'PAYABLE' | 'RECEIVABLE';
  amount: string | number;
  paidAt: string;
  method: PaymentMethod;
  referenceNo?: string | null;
  note?: string | null;
  createdBy?: Pick<AuthUser, 'id' | 'name' | 'email'> | null;
  party: { id: string; name: string };
  allocations: PaymentAllocationRecord[];
}
