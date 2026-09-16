export const tableSortOrders = ['asc', 'desc'] as const;
export type SortDirection = (typeof tableSortOrders)[number];

export function nextSortDirection(
  currentField: string,
  currentDirection: SortDirection,
  nextField: string,
): SortDirection {
  return currentField === nextField && currentDirection === 'asc' ? 'desc' : 'asc';
}
