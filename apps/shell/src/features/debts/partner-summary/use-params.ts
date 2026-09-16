'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { nextSortDirection } from '@/lib/routing/table-sort';
import type { PartnerSummaryParams } from '@/services/party.client';
import { getPartnerSummaryParams, type PartnerSummaryFilters } from './params';

function writePartnerSummaryUrl(params: PartnerSummaryParams) {
  const search = new URLSearchParams(window.location.search);

  search.set('page', String(params.page));
  search.set('pageSize', String(params.pageSize));
  search.set('sortBy', params.sortBy);
  search.set('sortOrder', params.sortOrder);

  if (params.q) search.set('partnerQ', params.q);
  else search.delete('partnerQ');

  if (params.type) search.set('partnerType', params.type);
  else search.delete('partnerType');

  if (params.balanceType) search.set('partnerBalanceType', params.balanceType);
  else search.delete('partnerBalanceType');

  window.history.pushState(null, '', `${window.location.pathname}?${search.toString()}`);
}

export function usePartnerSummaryParams() {
  const searchParams = useSearchParams();
  const params = useMemo(() => getPartnerSummaryParams(searchParams), [searchParams]);

  return {
    params,
    applyFilters: (filters: PartnerSummaryFilters) =>
      writePartnerSummaryUrl({
        ...params,
        page: 1,
        q: filters.q || undefined,
        type: filters.type || undefined,
        balanceType: filters.balanceType || undefined,
      }),
    clearFilters: () =>
      writePartnerSummaryUrl({
        ...params,
        page: 1,
        q: undefined,
        type: undefined,
        balanceType: undefined,
      }),
    changePage: (page: number) => writePartnerSummaryUrl({ ...params, page }),
    changePageSize: (pageSize: number) => writePartnerSummaryUrl({ ...params, page: 1, pageSize }),
    changeSort: (sortBy: PartnerSummaryParams['sortBy']) =>
      writePartnerSummaryUrl({
        ...params,
        page: 1,
        sortBy,
        sortOrder: nextSortDirection(params.sortBy, params.sortOrder, sortBy),
      }),
  };
}
