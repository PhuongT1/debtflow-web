import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';
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
    <TableContainer
      sx={{
        flex: { xs: '0 0 auto', md: '1 1 0' },
        minHeight: { md: 0 },
        overflow: 'auto',
      }}
    >
      <Table size="small" stickyHeader sx={{ minWidth: 1020 }}>
        <TableHead>
          <TableRow>
            <TableCell>
              <SortableTableHeader
                active={params.sortBy === 'name'}
                direction={params.sortOrder}
                label={t('partner')}
                onClick={() => changeSort('name')}
              />
            </TableCell>
            <TableCell>
              <SortableTableHeader
                active={params.sortBy === 'outstandingDocuments'}
                direction={params.sortOrder}
                label={t('outstandingDocuments')}
                onClick={() => changeSort('outstandingDocuments')}
              />
            </TableCell>
            <TableCell align="right">
              <SortableTableHeader
                active={params.sortBy === 'receivable'}
                direction={params.sortOrder}
                label={t('customerOwes')}
                onClick={() => changeSort('receivable')}
              />
            </TableCell>
            <TableCell align="right">
              <SortableTableHeader
                active={params.sortBy === 'payable'}
                direction={params.sortOrder}
                label={t('supplierOwed')}
                onClick={() => changeSort('payable')}
              />
            </TableCell>
            <TableCell align="right">{t('partnerDetails')}</TableCell>
            <TableCell align="right" />
          </TableRow>
        </TableHead>
        <TableBody>
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
            <TableRow hover key={party.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell>
                <Typography sx={{ fontWeight: 700 }}>{party.name}</Typography>
                <Typography color="text.secondary" variant="caption">
                  {party.phone ?? party.email ?? '-'}
                </Typography>
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>{party._count.debts}</TableCell>
              <TableCell align="right">
                <Box component="span" sx={{ color: 'error.main', fontWeight: 800 }}>
                  {formatMoney(party.balance?.receivable ?? 0)}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box component="span" sx={{ color: 'error.main', fontWeight: 800 }}>
                  {formatMoney(party.balance?.payable ?? 0)}
                </Box>
              </TableCell>
              <TableCell align="right">
                <PartnerDetailsDialog partner={party} />
              </TableCell>
              <TableCell align="right">
                <PartnerDocumentsDialog partyId={party.id} partyName={party.name} users={users} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
