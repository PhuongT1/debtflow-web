import type { SourcePartner } from './types';

export type ToPartnerSummaryPageSourceOptions = {
  items: SourcePartner[];
  page: number;
  pageSize: number;
  total: number;
};
