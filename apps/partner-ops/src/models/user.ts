import type { UserStatus } from '@/lib/domain';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  status?: UserStatus;
}
