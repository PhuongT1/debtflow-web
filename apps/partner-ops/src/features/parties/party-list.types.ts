import { z } from 'zod';
import { PartyType } from '@/lib/domain';

export type UserSummary = {
  id: string;
  name: string;
  email: string;
  status?: string;
};

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

export type PaginatedResult<Item> = {
  items: Item[];
  total: number;
  page: number;
  pageSize: number;
};

export const PARTY_FILTER_KEYS = [
  'q',
  'type',
  'assignedToId',
  'balanceType',
  'createdFrom',
  'createdTo',
  'page',
  'pageSize',
] as const;

export type PartyListFilters = Record<(typeof PARTY_FILTER_KEYS)[number], string | undefined>;

export function getPartyListFilters(searchParams: URLSearchParams): PartyListFilters {
  return Object.fromEntries(
    PARTY_FILTER_KEYS.flatMap((key) => {
      const value = searchParams.get(key);
      return value === null ? [] : [[key, value]];
    }),
  ) as PartyListFilters;
}

export function getPartyListApiPath(path: string, filters?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(filters ?? {}).forEach(([key, value]) => {
    if (value) searchParams.set(key, value);
  });

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
}

export function createPartyFilterSchema(invalidDateRangeMessage: string) {
  return z
    .object({
      q: z.string(),
      type: z.string(),
      assignedToId: z.string(),
      balanceType: z.string(),
      createdFrom: z.string(),
      createdTo: z.string(),
    })
    .refine(
      (values) =>
        !values.createdFrom || !values.createdTo || values.createdFrom <= values.createdTo,
      {
        message: invalidDateRangeMessage,
        path: ['createdTo'],
      },
    );
}

export type PartyFilterValues = z.infer<ReturnType<typeof createPartyFilterSchema>>;
