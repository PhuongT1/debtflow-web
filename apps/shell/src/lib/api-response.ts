import type { ApiEnvelope } from "@debtflow/contracts";
export type { ApiEnvelope, PaginationMeta } from "@debtflow/contracts";

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
