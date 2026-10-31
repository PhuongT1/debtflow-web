'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query/query-keys';

/** Overlay frames have independent caches; completion refreshes the initiating runtime. */
export function useRefreshParties() {
  const client = useQueryClient();
  return useCallback(() => {
    void client.invalidateQueries({ queryKey: queryKeys.parties.all });
  }, [client]);
}
