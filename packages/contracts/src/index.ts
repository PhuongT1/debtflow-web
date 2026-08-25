export type UserRole = "ADMIN" | "ACCOUNTANT" | "VIEWER";

export type CoreIdentity = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type ApiEnvelope<T> = {
  success: true;
  statusCode: number;
  code: string;
  message: string;
  data: T;
  meta?: { pagination?: PaginationMeta };
  timestamp: string;
  path: string;
};
