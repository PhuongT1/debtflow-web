import { z } from "zod";
import { apiGet, toDate, toMoney } from "@/lib/server-api";

const paymentQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

type Payment = {
  id: string;
  debtId: string;
  amount: ReturnType<typeof toMoney>;
  paidAt: Date;
  method: "CASH" | "BANK_TRANSFER" | "OTHER";
  referenceNo?: string | null;
  note?: string | null;
  createdBy?: { id: string; name: string; email: string } | null;
  debt: {
    id: string;
    code: string;
    originalAmount: ReturnType<typeof toMoney>;
    paidAmount: ReturnType<typeof toMoney>;
    party: { id: string; name: string };
  };
};

type RawPayment = Omit<Payment, "amount" | "paidAt" | "debt"> & {
  amount: unknown;
  paidAt: unknown;
  debt: Omit<Payment["debt"], "originalAmount" | "paidAmount"> & {
    originalAmount: unknown;
    paidAmount: unknown;
  };
};

type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};

export async function listPayments(input: unknown = {}) {
  const query = paymentQuerySchema.parse(input);
  const result = await apiGet<Paginated<RawPayment>>("payments", { query });

  return {
    ...result,
    items: result.items.map((payment): Payment => ({
      ...payment,
      amount: toMoney(payment.amount),
      paidAt: toDate(payment.paidAt) ?? new Date(),
      debt: payment.debt
        ? {
            ...payment.debt,
            originalAmount: toMoney(payment.debt.originalAmount),
            paidAmount: toMoney(payment.debt.paidAmount),
          }
        : payment.debt,
    })),
  };
}
