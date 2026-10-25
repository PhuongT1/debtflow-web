import { Box, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useTranslations } from 'next-intl';
import { DataTableCell, DataTableContainer } from '@debtflow/react-ui';
import { TruncatedText } from '@/components/ui/clamped-text';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
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

  return (
    <DataTableContainer
      bordered={false}
      containerSx={{ bgcolor: 'background.paper' }}
      fillAvailable
      scroll={{ x: 1260 }}
      size="small"
      sx={{ bgcolor: 'background.paper', tableLayout: 'fixed' }}
    >
      <TableHead>
        <TableRow>
          <DataTableCell fixed="left" sx={{ width: 300 }}>
            <SortableTableHeader
              active={params.sortBy === 'name'}
              direction={params.sortOrder}
              label={t('partner')}
              onClick={() => changeSort('name')}
            />
          </DataTableCell>
          <TableCell sx={{ width: 180 }}>
            <SortableTableHeader
              active={params.sortBy === 'outstandingDocuments'}
              direction={params.sortOrder}
              label={t('outstandingDocuments')}
              onClick={() => changeSort('outstandingDocuments')}
            />
          </TableCell>
          <TableCell align="right" sx={{ width: 230 }}>
            <SortableTableHeader
              active={params.sortBy === 'receivable'}
              direction={params.sortOrder}
              label={t('customerOwes')}
              onClick={() => changeSort('receivable')}
            />
          </TableCell>
          <TableCell align="right" sx={{ width: 240 }}>
            <SortableTableHeader
              active={params.sortBy === 'payable'}
              direction={params.sortOrder}
              label={t('supplierOwed')}
              onClick={() => changeSort('payable')}
            />
          </TableCell>
          <TableCell align="right" sx={{ whiteSpace: 'nowrap', width: 130 }}>
            {t('partnerDetails')}
          </TableCell>
          <DataTableCell fixed="right" sx={{ width: 180 }} />
        </TableRow>
      </TableHead>
      <TableBody
        sx={{
          '& > .MuiTableRow-root > .MuiTableCell-root': { bgcolor: 'background.paper' },
        }}
      >
        {!summary && isFetching ? (
          <TableRow>
            <TableCell align="center" colSpan={6} sx={{ py: 8 }}>
              {t('loadingDebtData')}
            </TableCell>
          </TableRow>
        ) : null}
        {summary?.items.length === 0 ? (
          <TableRow>
            <TableCell align="center" colSpan={6} sx={{ py: 8 }}>
              {t('partnerDebtEmpty')}
            </TableCell>
          </TableRow>
        ) : null}
        {summary?.items.map((party) => (
          <TableRow
            hover
            key={party.id}
            sx={{
              '&:hover .MuiTableCell-body': { bgcolor: 'action.hover' },
              '&:last-child td': { borderBottom: 0 },
            }}
          >
            <DataTableCell fixed="left" sx={{ width: 300 }}>
              <TruncatedText sx={{ fontWeight: 700 }} title={party.name}>
                {party.name}
              </TruncatedText>
            </DataTableCell>
            <TableCell sx={{ fontWeight: 600 }}>{party._count.debts}</TableCell>
            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
              <Box component="span" sx={{ color: 'error.main', fontWeight: 800 }}>
                {formatMoney(party.balance?.receivable ?? 0)}
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
              <Box component="span" sx={{ color: 'error.main', fontWeight: 800 }}>
                {formatMoney(party.balance?.payable ?? 0)}
              </Box>
            </TableCell>
            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
              <PartnerDetailsDialog partner={party} />
            </TableCell>
            <DataTableCell align="right" fixed="right" sx={{ whiteSpace: 'nowrap', width: 180 }}>
              <PartnerDocumentsDialog partyId={party.id} partyName={party.name} users={users} />
            </DataTableCell>
          </TableRow>
        ))}
      </TableBody>
    </DataTableContainer>
  );
}
