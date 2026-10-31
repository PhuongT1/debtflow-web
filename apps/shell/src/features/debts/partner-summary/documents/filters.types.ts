import type { Filters } from './filters';

export type DocumentFiltersProps = {
  filters: Filters;
  onApply: (filters: Filters) => void;
  onReset: () => void;
};
