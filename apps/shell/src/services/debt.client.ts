import { apiClient } from '@/lib/api/client';
import { buildApiRouteWithQuery, shellApiRoutes } from '@/lib/api/routes';

export function createDebt(input: unknown) {
  return apiClient.post(shellApiRoutes.debts.collection, input);
}

export function updateDebt(id: string, input: unknown) {
  return apiClient.patch(shellApiRoutes.debts.detail(id), input);
}

export function listPartnerDebtItems<T>(query: URLSearchParams, signal?: AbortSignal) {
  return apiClient.get<T>(buildApiRouteWithQuery(shellApiRoutes.debts.collection, query), { signal });
}
