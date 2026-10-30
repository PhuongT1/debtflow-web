'use client';

import {
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import { TableLayout } from '@packages/ui-react';

import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { AppDialog } from '@/components/ui/dialog/dialog';
import { FormDialog } from '@/components/ui/dialog/form-dialog';
import { DebtForm } from '@/features/debts/forms/debt/debt-form';

import { DocumentFilters } from './filters';
import { DocumentPagination } from './pagination';
import { PartnerDebtsTable } from './table';
import { DocumentTabs } from './tabs';
import type { PartnerDocumentUser } from './types';
import { usePartnerDocuments } from './use-partner-documents';

export function PartnerDocumentsDialog({
  partyId,
  partyName,
  users,
}: {
  partyId: string;
  partyName: string;
  users: PartnerDocumentUser[];
}) {
  const locale = useLocale();
  const t = useTranslations('Debts');
  const {
    isOpen,
    page,
    pageSize,
    filters,
    result,
    failed,
    isLoading,
    updateUrl,
    openDialog,
    close,
    applyFilters,
    resetFilters,
    refresh,
    filterKey,
  } = usePartnerDocuments(partyId);

  return (
    <>
      <Button onClick={openDialog} sx={{ whiteSpace: 'nowrap' }} variant="secondary">
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
            <TableLayout
              fillAvailable
              footer={
                <DocumentPagination
                  loading={isLoading}
                  page={page}
                  pageSize={pageSize}
                  total={result.total}
                  onPageChange={(nextPage) => updateUrl({ partnerDebtPage: String(nextPage) })}
                  onPageSizeChange={(nextPageSize) =>
                    updateUrl({ partnerDebtPage: '1', partnerDebtPageSize: String(nextPageSize) })
                  }
                />
              }
            >
              <PartnerDebtsTable debts={result} locale={locale} onPaymentRecorded={refresh} t={t} />
            </TableLayout>
          ) : null}
        </DialogContent>
      </AppDialog>
    </>
  );
}
