import type { PartnerSummaryParams } from '@/services/party.client';

export type PartnerSummaryFilters = {
  q: string;
  type: PartnerSummaryParams['type'] | '';
  balanceType: PartnerSummaryParams['balanceType'] | '';
};

export function getPartnerSummaryParams(
  params: Pick<URLSearchParams, 'get'>,
): PartnerSummaryParams {
  const page = Number(params.get('page'));
  const pageSize = Number(params.get('pageSize'));
  const partnerType = params.get('partnerType');
  const balanceType = params.get('partnerBalanceType');
  const sortBy = params.get('sortBy');
  const sortOrder = params.get('sortOrder');

  return {
    page: Number.isInteger(page) && page > 0 ? page : 1,
    pageSize: Number.isInteger(pageSize) && pageSize > 0 && pageSize <= 100 ? pageSize : 20,
    q: params.get('partnerQ') || undefined,
    type:
      partnerType === 'CUSTOMER' || partnerType === 'SUPPLIER' || partnerType === 'BOTH'
        ? partnerType
        : undefined,
    balanceType:
      balanceType === 'RECEIVABLE' || balanceType === 'PAYABLE' ? balanceType : undefined,
    sortBy:
      sortBy === 'outstandingDocuments' || sortBy === 'receivable' || sortBy === 'payable'
        ? sortBy
        : 'name',
    sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
  };
}
