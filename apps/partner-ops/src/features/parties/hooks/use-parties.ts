'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query/query-keys';
import { partyService } from '@/services/parties';

import { normalizePartyListFilters, type PartyListFilters } from '../model/party-filters';

export function useParties(filters: PartyListFilters) {
  const params = normalizePartyListFilters(filters);
  return useQuery({
    // Cached pages remain visible while every navigation revalidates server data.
    staleTime: 0,
    refetchOnMount: 'always',
    placeholderData: keepPreviousData,
    queryKey: queryKeys.parties.list(params),
    queryFn: ({ signal }) => partyService.list(params, signal),
  });
}
