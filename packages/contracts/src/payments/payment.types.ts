import type { AuthUser } from "../auth/user.types";

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "OTHER";

export interface PaymentDebtSummary {
  id: string;
  code: string;
  originalAmount: string | number;
  paidAmount: string | number;
  party: { id: string; name: string };
}

export interface PaymentRecord {
  id: string;
  debtId: string;
  amount: string | number;
  paidAt: string;
  method: PaymentMethod;
  referenceNo?: string | null;
  note?: string | null;
  createdBy?: Pick<AuthUser, "id" | "name" | "email"> | null;
  debt: PaymentDebtSummary;
}
