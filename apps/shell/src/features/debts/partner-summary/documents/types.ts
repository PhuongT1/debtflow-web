import type { Debt } from '@/services/debt.server';

export type ClientDebt = Omit<Debt, 'dueDate' | 'issueDate' | 'originalAmount' | 'paidAmount'> & {
  dueDate: string;
  issueDate: string;
  originalAmount: number | string;
  paidAmount: number | string;
};

export type PartnerDebtPage = {
  items: ClientDebt[];
  page: number;
  pageSize: number;
  total: number;
};
