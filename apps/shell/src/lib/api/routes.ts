/**
 * Internal Shell API route catalog. Keep paths grouped by domain; dynamic path
 * segments are builders so identifiers are encoded at one boundary.
 */
export const shellApiRoutes = {
  catalog: {
    options: '/api/catalog/options',
  },
  debts: {
    collection: '/api/debts',
    detail: (debtId: string) => '/api/debts/' + encodeURIComponent(debtId),
    payments: (debtId: string) => '/api/debts/' + encodeURIComponent(debtId) + '/payments',
  },
  imports: {
    debtWorkbook: '/api/imports/debts',
  },
  parties: {
    collection: '/api/parties',
    detail: (partyId: string) => '/api/parties/' + encodeURIComponent(partyId),
  },
  payments: {
    autoAllocation: '/api/payments/auto-allocate',
  },
} as const;

export function buildApiRouteWithQuery(route: string, query: URLSearchParams) {
  const queryString = query.toString();
  return queryString ? route + '?' + queryString : route;
}
