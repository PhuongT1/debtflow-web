import type { ToPartnerSummaryPageSourceOptions } from './types.types';
export type PartnerDebtSummary = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  code?: string | null;
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
  taxCode?: string | null;
  address?: string | null;
  balance?: { receivable: string | number; payable: string | number };
  _count: { debts: number };
};

export type PartnerSummaryPage = {
  items: PartnerDebtSummary[];
  total: number;
  page: number;
  pageSize: number;
};

export type SourcePartner = Omit<PartnerDebtSummary, 'balance'> & {
  balance?: { receivable?: unknown; payable?: unknown };
};

function toAmount(value: unknown) {
  return value == null ? '0' : String(value);
}

export function toPartnerSummaryPage(
  source: ToPartnerSummaryPageSourceOptions,
): PartnerSummaryPage {
  return {
    ...source,
    items: source.items.map((party) => ({
      ...party,
      balance: {
        receivable: toAmount(party.balance?.receivable),
        payable: toAmount(party.balance?.payable),
      },
    })),
  };
}
