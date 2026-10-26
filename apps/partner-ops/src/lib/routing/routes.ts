import { hrefWithPage, hrefWithPageSize } from '@/lib/pagination';

type RouteFilters = Record<string, string | undefined>;
const partiesPath = '/parties';

export const appRoutes = {
  parties: {
    list: partiesPath,
    detail: (id: string) => `${partiesPath}/${encodeURIComponent(id)}`,
    page: (filters: RouteFilters, page: number) => hrefWithPage(partiesPath, filters, page),
    pageSize: (filters: RouteFilters, size: number) => hrefWithPageSize(partiesPath, filters, size),
    filtered: (filters: RouteFilters) => hrefWithPage(partiesPath, filters, 1),
  },
  debts: { detail: (id: string) => `/debts/${encodeURIComponent(id)}` },
  payments: { forParty: (id: string) => `/payments?partyId=${encodeURIComponent(id)}` },
};
