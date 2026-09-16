export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponseEnvelope<T> {
  success: true;
  statusCode: number;
  code: string;
  message: string;
  data: T;
  meta?: { pagination?: PaginationMeta };
  timestamp: string;
  path: string;
}

/** Backward compatibility alias */
export type ApiEnvelope<T> = ApiResponseEnvelope<T>;

export function unwrapApiResponse<T>(body: unknown): T {
  if (!body || typeof body !== 'object' || !('data' in body)) {
    return body as T;
  }

  const envelope = body as ApiResponseEnvelope<unknown>;
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
