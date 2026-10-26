'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { partyService } from '@/services/parties/party.service';
import { normalizePartyListFilters, type PartyListFilters } from '../model/party-filters';

export function useParties(filters: PartyListFilters) {
  const params = normalizePartyListFilters(filters);
  return useQuery({
    queryKey: queryKeys.parties.list(params),
    queryFn: ({ signal }) => partyService.list(params, signal),
  });
}
