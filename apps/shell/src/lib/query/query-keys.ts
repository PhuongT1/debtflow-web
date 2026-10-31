import type { PartnerSummaryParams } from '@/services/party.client';

export const queryKeys = {
  catalog: { options: () => ['catalog-options'] as const },
  parties: { options: () => ['parties', 'options'] as const },
  partnerSummary: {
    all: ['partner-summary'] as const,
    list: (params: PartnerSummaryParams) => ['partner-summary', params] as const,
  },
  partnerDocuments: {
    all: ['debts', 'partner-documents'] as const,
    list: (params: URLSearchParams) => ['debts', 'partner-documents', params.toString()] as const,
  },
};
