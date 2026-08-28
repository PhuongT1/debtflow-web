export type UserRole = "ADMIN" | "ACCOUNTANT" | "VIEWER";

export type CoreIdentity = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "OTHER";

export type PaymentRecord = {
  id: string;
  debtId: string;
  amount: string | number;
  paidAt: string;
  method: PaymentMethod;
  referenceNo?: string | null;
  note?: string | null;
  createdBy?: Pick<CoreIdentity, "id" | "name" | "email"> | null;
  debt: {
    id: string;
    code: string;
    originalAmount: string | number;
    paidAmount: string | number;
    party: { id: string; name: string };
  };
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
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

export function unwrapApiResponse<T>(body: unknown): T {
  if (!body || typeof body !== "object" || !("data" in body)) {
    return body as T;
  }

  const envelope = body as ApiEnvelope<unknown>;
  const pagination = envelope.meta?.pagination;

  if (pagination && Array.isArray(envelope.data)) {
    return {
      items: envelope.data,
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPreviousPage: pagination.hasPreviousPage,
    } as T;
  }

  return envelope.data as T;
}
