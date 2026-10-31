import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { createServerPrefetchQueryClient } from '@packages/ui-react';

import { queryKeys } from '@/lib/query/query-keys';
import { listParties } from '@/services/party.server';

import { getPartnerSummaryParams } from './params';
import { PartnerSummary } from './partner-summary';
import type { PartnerSummaryServerProps } from './partner-summary-server.types';
import { toPartnerSummaryPage } from './types';

export async function PartnerSummaryServer({ filters, users }: PartnerSummaryServerProps) {
  const params = getPartnerSummaryParams(
    new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== undefined) as Array<[string, string]>,
    ),
  );
  const prefetchQueryClient = createServerPrefetchQueryClient();

  await prefetchQueryClient.query({
    queryKey: queryKeys.partnerSummary.list(params),
    queryFn: async () => toPartnerSummaryPage(await listParties(params)),
  });

  return (
    <HydrationBoundary state={dehydrate(prefetchQueryClient)}>
      <PartnerSummary users={users} />
    </HydrationBoundary>
  );
}
