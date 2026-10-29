'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query/query-keys';
import { partyService } from '@/services/parties';

export function useDeleteParty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partyService.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.parties.all });
    },
  });
}
