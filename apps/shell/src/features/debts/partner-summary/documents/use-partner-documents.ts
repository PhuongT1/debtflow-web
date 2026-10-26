'use client';

import { useMemo } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';
import { listPartnerDebtItems } from '@/services/debt.client';
import type { PartnerDebtFilters, PartnerDebtPage } from './types';

const detailKeys = [
  'partnerDebtId',
  'partnerDebtPage',
  'partnerDebtPageSize',
  'partnerDebtQ',
  'partnerDebtType',
  'partnerDebtStatus',
  'partnerDebtDueDateFrom',
  'partnerDebtDueDateTo',
] as const;

export function usePartnerDocuments(partyId: string) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const isOpen = searchParams.get('partnerDebtId') === partyId;
  const page = positiveInteger(searchParams.get('partnerDebtPage'), 1);
  const pageSize = positiveInteger(searchParams.get('partnerDebtPageSize'), 10);
  const filters = useMemo<PartnerDebtFilters>(
    () => ({
      q: searchParams.get('partnerDebtQ') ?? '',
      type: searchParams.get('partnerDebtType') ?? '',
      status: searchParams.get('partnerDebtStatus') ?? '',
      dueDateFrom: searchParams.get('partnerDebtDueDateFrom') ?? '',
      dueDateTo: searchParams.get('partnerDebtDueDateTo') ?? '',
    }),
    [searchParams],
  );

  const apiQuery = useMemo(() => {
    const next = new URLSearchParams({ partyId, page: String(page), pageSize: String(pageSize) });
    if (filters.q) next.set('q', filters.q);
    if (filters.type) next.set('type', filters.type);
    if (filters.status) next.set('status', filters.status);
    if (filters.dueDateFrom) next.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) next.set('dueDateTo', filters.dueDateTo);
    return next;
  }, [filters, page, pageSize, partyId]);
  const debtQuery = useQuery({
    enabled: isOpen,
    queryKey: ['debts', 'partner-documents', apiQuery.toString()],
    queryFn: ({ signal }) => listPartnerDebtItems<PartnerDebtPage>(apiQuery, signal),
    placeholderData: keepPreviousData,
  });
  const result = debtQuery.data;
  const failed = debtQuery.isError;
  const isLoading = debtQuery.isFetching;

  const updateUrl = (updates: Record<string, string | undefined>, replace = false) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const href = next.toString() ? pathname + '?' + next.toString() : pathname;

    // Native history keeps this as client state: no page-level Server Component refetch.
    window.history[replace ? 'replaceState' : 'pushState'](null, '', href);
  };
  const openDialog = () =>
    updateUrl({
      partnerDebtId: partyId,
      partnerDebtPage: '1',
      partnerDebtPageSize: searchParams.get('partnerDebtPageSize') ?? '10',
    });
  const close = () =>
    updateUrl(Object.fromEntries(detailKeys.map((key) => [key, undefined])), true);
  const applyFilters = (nextFilters: Omit<PartnerDebtFilters, 'type'>) =>
    updateUrl({
      partnerDebtPage: '1',
      partnerDebtQ: nextFilters.q,
      partnerDebtStatus: nextFilters.status,
      partnerDebtDueDateFrom: nextFilters.dueDateFrom,
      partnerDebtDueDateTo: nextFilters.dueDateTo,
    });
  const resetFilters = () =>
    updateUrl({
      partnerDebtPage: '1',
      partnerDebtQ: undefined,
      partnerDebtType: undefined,
      partnerDebtStatus: undefined,
      partnerDebtDueDateFrom: undefined,
      partnerDebtDueDateTo: undefined,
    });
  const refresh = () =>
    void queryClient.invalidateQueries({ queryKey: ['debts', 'partner-documents'] });
  const filterKey = [filters.q, filters.status, filters.dueDateFrom, filters.dueDateTo].join('|');

  return {
    isOpen,
    page,
    pageSize,
    filters,
    result,
    failed,
    isLoading,
    updateUrl,
    openDialog,
    close,
    applyFilters,
    resetFilters,
    refresh,
    filterKey,
  };
}

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
