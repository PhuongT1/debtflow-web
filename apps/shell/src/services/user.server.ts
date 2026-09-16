import 'server-only';
import { apiServer, toDate } from '@/lib/api/server';
import type { PaginatedResult } from '@debtflow/contracts';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: 'OWNER' | 'ADMIN' | 'ACCOUNTANT' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: Date;
};

type RawUser = Omit<User, 'createdAt'> & { createdAt?: unknown };

function normalizeUser(user: RawUser): User {
  return {
    ...user,
    createdAt: toDate(user.createdAt) ?? undefined,
  };
}

export async function listUsers(query: Record<string, string | number | boolean | undefined> = {}) {
  const result = await apiServer.get<PaginatedResult<RawUser>>('users', { query });

  return {
    ...result,
    items: result.items.map(normalizeUser),
  };
}

export async function listUserOptions() {
  const users = await apiServer.get<RawUser[]>('users/options');

  return users.map(normalizeUser);
}
