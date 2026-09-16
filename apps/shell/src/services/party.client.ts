import { apiClient } from '@/lib/api/client';
import { buildApiRouteWithQuery, shellApiRoutes } from '@/lib/api/routes';

export type PartyOption = { id: string; name: string };
export type PartnerSummaryParams = {
  page: number;
  pageSize: number;
  q?: string;
  type?: 'CUSTOMER' | 'SUPPLIER' | 'BOTH';
  balanceType?: 'RECEIVABLE' | 'PAYABLE';
  sortBy: 'name' | 'outstandingDocuments' | 'receivable' | 'payable';
  sortOrder: 'asc' | 'desc';
};

export function listPartyDebtSummaries<T>(params: PartnerSummaryParams, signal?: AbortSignal) {
  const search = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
  if (params.q) search.set('q', params.q);
  if (params.type) search.set('type', params.type);
  if (params.balanceType) search.set('balanceType', params.balanceType);
  return apiClient.get<T>(buildApiRouteWithQuery(shellApiRoutes.parties.collection, search), {
    signal,
  });
}

export async function listPartyOptions(signal?: AbortSignal) {
  const result = await apiClient.get<{ items: PartyOption[] }>(
    buildApiRouteWithQuery(
      shellApiRoutes.parties.collection,
      new URLSearchParams({ page: '1', pageSize: '100' }),
    ),
    { signal },
  );
  return result.items;
}

export function updateParty(partyId: string, input: unknown) {
  return apiClient.patch(shellApiRoutes.parties.detail(partyId), input);
}
