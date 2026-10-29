import type { PartyListParams } from '@/services/parties';

export const PARTY_FILTER_KEYS = [
  'q',
  'type',
  'assignedToId',
  'balanceType',
  'createdFrom',
  'createdTo',
  'page',
  'pageSize',
] as const satisfies readonly (keyof PartyListParams)[];

export type PartyListFilters = Pick<PartyListParams, (typeof PARTY_FILTER_KEYS)[number]>;

export function getPartyListFilters(searchParams: URLSearchParams): PartyListFilters {
  return Object.fromEntries(
    PARTY_FILTER_KEYS.flatMap((key) => {
      const value = searchParams.get(key);
      return value ? [[key, value]] : [];
    }),
  ) as PartyListFilters;
}

export function normalizePartyListFilters(filters: PartyListFilters): PartyListFilters {
  return { ...filters, page: filters.page ?? '1', pageSize: filters.pageSize ?? '20' };
}
