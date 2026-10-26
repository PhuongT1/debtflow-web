import type { PaginatedResponse, PaginationMeta } from '@debtflow/contracts';

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

function isPaginationMeta(value: unknown): value is PaginationMeta {
  return (
    isRecord(value) &&
    Number.isInteger(value.page) &&
    Number(value.page) >= 1 &&
    Number.isInteger(value.pageSize) &&
    Number(value.pageSize) >= 1 &&
    Number.isInteger(value.total) &&
    Number(value.total) >= 0 &&
    Number.isInteger(value.totalPages) &&
    Number(value.totalPages) >= 0 &&
    typeof value.hasNextPage === 'boolean' &&
    typeof value.hasPreviousPage === 'boolean'
  );
}

/** Checks the collection envelope; item validation remains with the domain boundary. */
export function parsePaginatedResponse<Item>(body: unknown): PaginatedResponse<Item> {
  if (
    !isRecord(body) ||
    !Array.isArray(body.data) ||
    !isRecord(body.meta) ||
    !isPaginationMeta(body.meta.pagination)
  ) {
    throw new Error('Invalid paginated API response');
  }
  return { items: body.data as Item[], meta: body.meta.pagination };
}
