'use client';

import { useRefreshParties } from '../hooks/use-refresh-parties';
import { partnerListLayout } from '@packages/platform-registry';
import { useTranslations, useFormatter } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Alert } from '@mui/material';
import { DataTable } from '@/components/tables';
import { FormDialog } from '@/components/ui/dialog/form-dialog';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { Page, PageHeader } from '@/components/ui/page/page';
import { PartyForm } from '@/features/parties/form/party-form';
import { appRoutes } from '@/lib/routing/routes';
import { getPartyListColumns } from './columns';
import { PartyListToolbar } from './toolbar';
import { getPartyListFilters } from '../model/party-filters';
import { useParties } from '../hooks/use-parties';
import { useActiveUsers } from '@/hooks/use-active-users';
import { getApiErrorMessage } from '@/lib/api/api-error';

export function PartyList() {
  const refresh = useRefreshParties();
  const t = useTranslations('Parties');
  const apiText = useTranslations('Api');
  const format = useFormatter();
  const searchParams = useSearchParams();
  const filters = getPartyListFilters(searchParams);

  const partiesQuery = useParties(filters);
  const usersQuery = useActiveUsers();
  const {
    items = [],
    meta = {
      total: 0,
      page: Number(filters.page ?? 1),
      pageSize: Number(filters.pageSize ?? 20),
    },
  } = partiesQuery.data ?? {};
  const activeUsers = usersQuery.data ?? [];
  const error = partiesQuery.error ?? usersQuery.error;
  const isLoading = partiesQuery.isLoading || usersQuery.isLoading;

  const columns = getPartyListColumns({
    activeUsers,
    onCompleted: refresh,
    formatMoney: (value) =>
      t('money', { amount: format.number(Number(value), { maximumFractionDigits: 0 }) }),
    labels: {
      actions: t('actions'),
      both: t('both'),
      contact: t('contact'),
      customer: t('customer'),
      delete: t('delete'),
      deleteMessage: t('deleteMessage'),
      name: t('name'),
      payable: t('payable'),
      receivable: t('receivable'),
      payments: t('payments'),
      sale: t('sale'),
      save: t('save'),
      supplier: t('supplier'),
      type: t('type'),
      view: t('view'),
      viewDescription: t('viewDescription'),
      viewDialog: (name) => t('viewDialog', { name }),
      viewPayments: t('viewPayments'),
    },
  });

  return (
    <Page contentWidth="wide" fillAvailable>
      <PageHeader
        compact
        title={t('title')}
        actions={
          <>
            <FormDialog
              remote={{ view: 'party-form', title: t('add'), size: 'md' }}
              onCompleted={refresh}
              buttonLabel={t('add')}
              description={t('addDescription')}
              title={t('add')}
            >
              <PartyForm users={activeUsers} />
            </FormDialog>
            <HelpModal
              buttonLabel={t('help')}
              title={t('helpTitle')}
              description={t('helpDescription')}
              steps={[t('helpStep1'), t('helpStep2'), t('helpStep3'), t('helpStep4')]}
              tips={[t('helpTip1'), t('helpTip2')]}
            />
          </>
        }
      />

      {error ? <Alert severity="error">{getApiErrorMessage(error, apiText)}</Alert> : null}
      <DataTable
        columns={columns}
        emptyMessage={t('empty')}
        fillHeight
        hrefForPage={(page) => appRoutes.parties.page(filters, page)}
        hrefForPageSize={(pageSize) => appRoutes.parties.pageSize(filters, pageSize)}
        loading={isLoading}
        size={partnerListLayout.size}
        {...meta}
        rows={items}
        toolbar={<PartyListToolbar activeUsers={activeUsers} />}
      />
    </Page>
  );
}
