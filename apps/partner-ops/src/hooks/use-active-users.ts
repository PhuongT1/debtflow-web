'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query/query-keys';
import { selectActiveUsers, userService } from '@/services/user.service';

/** App-wide user options; independent of the Parties feature. */
export function useActiveUsers() {
  return useQuery({
    queryKey: queryKeys.users.options(),
    queryFn: ({ signal }) => userService.options(signal),
    select: selectActiveUsers,
    staleTime: 5 * 60_000,
  });
}
