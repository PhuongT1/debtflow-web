import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { createServerPrefetchQueryClient } from '@debtflow/react-ui';
import { listParties } from '@/services/party.server';
import { PartnerSummary } from './partner-summary';
import { getPartnerSummaryParams } from './params';
import { toPartnerSummaryPage } from './types';

export async function PartnerSummaryServer({
  filters,
  users,
}: {
  filters: Record<string, string | undefined>;
  users: Array<{ id: string; name: string; email: string }>;
}) {
  const params = getPartnerSummaryParams(
    new URLSearchParams(
      Object.entries(filters).filter(([, value]) => value !== undefined) as Array<[string, string]>,
    ),
  );
  const prefetchQueryClient = createServerPrefetchQueryClient();

  await prefetchQueryClient.query({
    queryKey: ['partner-summary', params],
    queryFn: async () => toPartnerSummaryPage(await listParties(params)),
  });

  return (
    <HydrationBoundary state={dehydrate(prefetchQueryClient)}>
      <PartnerSummary users={users} />
    </HydrationBoundary>
  );
}
