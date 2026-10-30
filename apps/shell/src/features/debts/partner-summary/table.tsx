import { Box } from '@mui/material';
import { useTranslations } from 'next-intl';

import { type DataTableColumn, DataTableContent, SortableTableHeader } from '@packages/ui-react';

import { applyTableLayout } from '@/components/tables/page-layouts';
import { TruncatedText } from '@/components/ui/clamped-text';
import { formatMoney } from '@/lib/presentation/formatters';
import type { PartnerSummaryParams } from '@/services/party.client';

import { PartnerDocumentsDialog } from './documents/dialog';
import { PartnerDetailsDialog } from './partner-details-dialog';
import type { PartnerSummaryPage } from './types';

type Props = {
  changeSort: (sortBy: PartnerSummaryParams['sortBy']) => void;
  isFetching: boolean;
  params: PartnerSummaryParams;
  summary?: PartnerSummaryPage;
  users: Array<{ id: string; name: string; email: string }>;
};

export function PartnerSummaryTable({ changeSort, isFetching, params, summary, users }: Props) {
  const t = useTranslations('Debts');
  const sortableTitle = (sortBy: PartnerSummaryParams['sortBy'], label: string) => (
    <SortableTableHeader
      active={params.sortBy === sortBy}
      direction={params.sortOrder}
      label={label}
      onClick={() => changeSort(sortBy)}
    />
  );
  const columns: Array<DataTableColumn<PartnerSummaryPage['items'][number]>> = [
    {
      key: 'name',
      title: sortableTitle('name', t('partner')),
      render: (party) => (
        <TruncatedText sx={{ fontWeight: 700 }} title={party.name}>
          {party.name}
        </TruncatedText>
      ),
    },
    {
      key: 'outstandingDocuments',
      title: sortableTitle('outstandingDocuments', t('outstandingDocuments')),
      render: (party) => party._count.debts,
    },
    {
      key: 'receivable',
      title: sortableTitle('receivable', t('customerOwes')),
      align: 'right',
      render: (party) => (
        <Box component="span" sx={{ color: 'error.main', fontWeight: 800, whiteSpace: 'nowrap' }}>
          {formatMoney(party.balance?.receivable ?? 0)}
        </Box>
      ),
    },
    {
      key: 'payable',
      title: sortableTitle('payable', t('supplierOwed')),
      align: 'right',
      render: (party) => (
        <Box component="span" sx={{ color: 'error.main', fontWeight: 800, whiteSpace: 'nowrap' }}>
          {formatMoney(party.balance?.payable ?? 0)}
        </Box>
      ),
    },
    {
      key: 'details',
      title: t('partnerDetails'),
      align: 'right',
      render: (party) => <PartnerDetailsDialog partner={party} />,
    },
    {
      key: 'actions',
      title: null,
      align: 'right',
      render: (party) => (
        <PartnerDocumentsDialog partyId={party.id} partyName={party.name} users={users} />
      ),
    },
  ];
  return (
    <DataTableContent
      columns={applyTableLayout(columns, 'debts')}
      size="small"
      dataSource={summary?.items ?? []}
      rowKey="id"
      emptyMessage={t('partnerDebtEmpty')}
      loading={!summary && isFetching}
      scroll={{ x: 1260 }}
      tableSx={{ tableLayout: 'fixed' }}
    />
  );
}
