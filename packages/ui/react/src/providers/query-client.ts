import { environmentManager, QueryClient } from '@tanstack/react-query';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 60_000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** Creates an isolated query cache for a Server Component prefetch. */
export function createServerPrefetchQueryClient() {
  return createQueryClient();
}

/** Keep one browser cache while isolating each server render's query data. */
export function getProviderQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
