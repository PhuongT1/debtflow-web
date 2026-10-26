import { apiRequest } from '@/lib/api/http-client';
import type { UserSummary } from '@/models/user';
import { UserStatus } from '@/lib/domain';

export const userService = {
  options: (signal?: AbortSignal) => apiRequest<UserSummary[]>({ url: '/users/options', signal }),
};

export function selectActiveUsers(users: UserSummary[]) {
  return users
    .filter((user) => user.status === UserStatus.ACTIVE)
    .sort((left, right) => left.name.localeCompare(right.name));
}
