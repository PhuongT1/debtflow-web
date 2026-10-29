'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { partyService } from '@/services/parties';
import type { PartyDetailParams } from '@/services/parties';

export function useParty({ id }: PartyDetailParams) {
  return useQuery({
    queryKey: queryKeys.parties.detail(id),
    queryFn: ({ signal }) => partyService.detail({ id }, signal),
  });
}
