export type UserRole = "ADMIN" | "ACCOUNTANT" | "VIEWER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

/** Backward compatibility alias */
export type CoreIdentity = AuthUser;
