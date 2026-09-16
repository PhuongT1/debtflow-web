'use client';

import { useMemo } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { AppDialog } from '@/components/ui/app-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { FormDialog } from '@/components/ui/form-dialog';
import { DebtForm } from '@/features/debts/forms/debt-form';
import { listPartnerDebtItems } from '@/services/debt.client';
import { DocumentFilters } from './filters';
import { DocumentPagination } from './pagination';
import { DocumentTabs } from './tabs';
import { PartnerDebtsTable } from './table';
import type { PartnerDebtPage } from './types';

type UserOption = { id: string; name: string; email: string };
type PartnerDebtFilters = {
  dueDateFrom: string;
  dueDateTo: string;
  q: string;
  status: string;
  type: string;
};
const detailKeys = [
  'partnerDebtId',
  'partnerDebtPage',
  'partnerDebtPageSize',
  'partnerDebtQ',
  'partnerDebtType',
  'partnerDebtStatus',
  'partnerDebtDueDateFrom',
  'partnerDebtDueDateTo',
] as const;

export function PartnerDocumentsDialog({
  partyId,
  partyName,
  users,
}: {
  partyId: string;
  partyName: string;
  users: UserOption[];
}) {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('Debts');
  const queryClient = useQueryClient();
  const isOpen = searchParams.get('partnerDebtId') === partyId;
  const page = positiveInteger(searchParams.get('partnerDebtPage'), 1);
  const pageSize = positiveInteger(searchParams.get('partnerDebtPageSize'), 10);
  const filters = useMemo<PartnerDebtFilters>(
    () => ({
      q: searchParams.get('partnerDebtQ') ?? '',
      type: searchParams.get('partnerDebtType') ?? '',
      status: searchParams.get('partnerDebtStatus') ?? '',
      dueDateFrom: searchParams.get('partnerDebtDueDateFrom') ?? '',
      dueDateTo: searchParams.get('partnerDebtDueDateTo') ?? '',
    }),
    [searchParams],
  );

  const apiQuery = useMemo(() => {
    const next = new URLSearchParams({ partyId, page: String(page), pageSize: String(pageSize) });
    if (filters.q) next.set('q', filters.q);
    if (filters.type) next.set('type', filters.type);
    if (filters.status) next.set('status', filters.status);
    if (filters.dueDateFrom) next.set('dueDateFrom', filters.dueDateFrom);
    if (filters.dueDateTo) next.set('dueDateTo', filters.dueDateTo);
    return next;
  }, [filters, page, pageSize, partyId]);
  const debtQuery = useQuery({
    enabled: isOpen,
    queryKey: ['debts', 'partner-documents', apiQuery.toString()],
    queryFn: ({ signal }) => listPartnerDebtItems<PartnerDebtPage>(apiQuery, signal),
    placeholderData: keepPreviousData,
  });
  const result = debtQuery.data;
  const failed = debtQuery.isError;
  const isLoading = debtQuery.isFetching;

  const updateUrl = (updates: Record<string, string | undefined>, replace = false) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    const href = next.toString() ? pathname + '?' + next.toString() : pathname;

    // Native history keeps this as client state: no page-level Server Component refetch.
    window.history[replace ? 'replaceState' : 'pushState'](null, '', href);
  };
  const openDialog = () =>
    updateUrl({
      partnerDebtId: partyId,
      partnerDebtPage: '1',
      partnerDebtPageSize: searchParams.get('partnerDebtPageSize') ?? '10',
    });
  const close = () =>
    updateUrl(Object.fromEntries(detailKeys.map((key) => [key, undefined])), true);
  const applyFilters = (nextFilters: Omit<PartnerDebtFilters, 'type'>) =>
    updateUrl({
      partnerDebtPage: '1',
      partnerDebtQ: nextFilters.q,
      partnerDebtStatus: nextFilters.status,
      partnerDebtDueDateFrom: nextFilters.dueDateFrom,
      partnerDebtDueDateTo: nextFilters.dueDateTo,
    });
  const resetFilters = () =>
    updateUrl({
      partnerDebtPage: '1',
      partnerDebtQ: undefined,
      partnerDebtType: undefined,
      partnerDebtStatus: undefined,
      partnerDebtDueDateFrom: undefined,
      partnerDebtDueDateTo: undefined,
    });
  const refresh = () =>
    void queryClient.invalidateQueries({ queryKey: ['debts', 'partner-documents'] });
  const filterKey = [filters.q, filters.status, filters.dueDateFrom, filters.dueDateTo].join('|');

  return (
    <>
      <Button onClick={openDialog} variant="secondary">
        {t('viewPartnerDebts')}
      </Button>
      <AppDialog
        fullWidth
        maxWidth="xl"
        open={isOpen}
        slotProps={{
          paper: {
            sx: {
              display: 'flex',
              flexDirection: 'column',
              height: 'min(820px, calc(100dvh - 48px))',
            },
          },
        }}
        onClose={close}
      >
        <DialogTitle sx={{ flexShrink: 0, pr: 6 }}>
          <Box
            sx={{
              alignItems: { sm: 'center' },
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1.5,
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography component="div" sx={{ fontSize: 20, fontWeight: 900 }}>
                {t('partnerDebtDetail', { partner: partyName })}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {t('partnerDebtDetailDescription')}
              </Typography>
            </Box>
            <FormDialog
              buttonIcon="add"
              buttonLabel={t('createForPartner')}
              buttonSize="small"
              title={t('createForPartner')}
              description={t('createForPartnerDescription')}
            >
              <DebtForm
                defaultPartyId={partyId}
                lockParty
                onSuccess={refresh}
                parties={[{ id: partyId, name: partyName }]}
                users={users}
              />
            </FormDialog>
          </Box>
          <IconButton
            aria-label={t('close')}
            onClick={close}
            sx={{
              '& .MuiSvgIcon-root': { transform: 'translateX(1px)' },
              '&:hover': { bgcolor: 'action.hover' },
              height: 40,
              p: 1,
              position: 'absolute',
              right: 12,
              top: 12,
              width: 40,
            }}
          >
            <AppIcon fontSize="small" name="close" />
          </IconButton>
        </DialogTitle>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0, px: 3, py: 2 }}>
          <DocumentFilters
            key={filterKey}
            filters={filters}
            onApply={applyFilters}
            onReset={resetFilters}
          />
          <Box sx={{ mt: 1.5 }}>
            <DocumentTabs
              value={filters.type as '' | 'RECEIVABLE' | 'PAYABLE'}
              onChange={(type) =>
                updateUrl({ partnerDebtPage: '1', partnerDebtType: type || undefined })
              }
            />
          </Box>
        </Box>
        <DialogContent
          dividers
          sx={{
            bgcolor: 'background.default',
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            minHeight: 0,
            py: 2,
          }}
          aria-busy={isLoading}
        >
          {isLoading ? <LinearProgress aria-label={t('loadingDocuments')} sx={{ mb: 1 }} /> : null}
          {failed ? <Typography color="error">{t('documentsLoadError')}</Typography> : null}
          {!failed && !result ? (
            <Typography color="text.secondary">{t('loadingDocuments')}</Typography>
          ) : null}
          {result ? (
            <PartnerDebtsTable debts={result} locale={locale} onPaymentRecorded={refresh} t={t} />
          ) : null}
          {result ? (
            <DocumentPagination
              page={page}
              pageSize={pageSize}
              loading={isLoading}
              total={result.total}
              onPageChange={(nextPage) => updateUrl({ partnerDebtPage: String(nextPage) })}
              onPageSizeChange={(nextPageSize) =>
                updateUrl({ partnerDebtPage: '1', partnerDebtPageSize: String(nextPageSize) })
              }
            />
          ) : null}
        </DialogContent>
      </AppDialog>
    </>
  );
}

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}
