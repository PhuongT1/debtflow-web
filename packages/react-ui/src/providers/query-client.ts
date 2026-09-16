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

/**
 * Supplies QueryClientProvider with a new server cache per SSR render and one
 * stable cache in the browser. A Client Component also renders during SSR.
 */
export function getProviderQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
