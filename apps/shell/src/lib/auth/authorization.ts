import type { UserRole } from '@/lib/domain/enums';

const roleRank: Record<UserRole, number> = { VIEWER: 1, ACCOUNTANT: 2, ADMIN: 3, OWNER: 4 };

export function canAccess(userRole: UserRole, minimumRole: UserRole) {
  return roleRank[userRole] >= roleRank[minimumRole];
}

export function assertRole(userRole: UserRole | undefined, minimumRole: UserRole) {
  if (!userRole || !canAccess(userRole, minimumRole)) {
    throw new Error('Bạn không có quyền thực hiện thao tác này');
  }
}
