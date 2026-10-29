'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { partyService } from '@/services/parties';
import type { CreatePartyParams, UpdatePartyParams } from '@/services/parties';

export function useSaveParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreatePartyParams | UpdatePartyParams) =>
      'id' in params ? partyService.update(params) : partyService.create(params),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.parties.all });
    },
  });
}
