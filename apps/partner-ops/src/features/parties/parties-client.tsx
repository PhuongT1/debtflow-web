'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Alert } from '@mui/material';
import { DataTable } from '@/components/ui/data-table';
import { FormDialog } from '@/components/ui/form-dialog';
import { HelpModal } from '@/components/ui/help-modal';
import { Page, PageHeader } from '@/components/ui/page';
import { PartyForm } from '@/features/parties/party-form';
import { requestJson } from '@/lib/api-client';
import { hrefWithPage, hrefWithPageSize } from '@/lib/pagination';
import { getPartyListColumns } from '@/features/parties/party-list-columns';
import { PartyListToolbar } from '@/features/parties/party-list-toolbar';
import {
  getPartyListApiPath,
  getPartyListFilters,
  type PaginatedResult,
  type Party,
  type UserSummary,
} from '@/features/parties/party-list.types';

export function PartiesClient() {
  const t = useTranslations('Parties');
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();
  const filters = getPartyListFilters(searchParams);

  const partiesQuery = useQuery({
    queryKey: ['parties', searchKey],
    queryFn: () =>
      requestJson<PaginatedResult<Party>>(getPartyListApiPath('/api/parties', filters)),
  });
  const usersQuery = useQuery({
    queryKey: ['active-users'],
    queryFn: () => requestJson<UserSummary[]>('/api/users/options'),
    staleTime: 5 * 60_000,
  });
  const parties = partiesQuery.data ?? {
    items: [],
    total: 0,
    page: Number(filters.page ?? 1),
    pageSize: Number(filters.pageSize ?? 20),
  };
  const activeUsers = (usersQuery.data ?? [])
    .filter((user) => user.status === 'ACTIVE')
    .sort((left, right) => left.name.localeCompare(right.name));
  const error = partiesQuery.error ?? usersQuery.error;
  const isLoading = partiesQuery.isLoading || usersQuery.isLoading;

  const columns = getPartyListColumns({
    activeUsers,
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
            <FormDialog buttonLabel={t('add')} description={t('addDescription')} title={t('add')}>
              <PartyForm users={activeUsers} />
            </FormDialog>
            <HelpModal
              buttonLabel={t('help')}
              title="Cách quản lý khách hàng"
              description="Mỗi khách chỉ nên tạo một lần, sau đó mọi công nợ và thanh toán sẽ gom về hồ sơ khách đó."
              steps={[
                'Tạo khách mới với tên, số điện thoại, mã số thuế nếu có.',
                'Gán sale phụ trách để biết ai phải theo dõi công nợ của khách này.',
                'Nhập hạn mức công nợ nếu shop/công ty có giới hạn cho khách mua thiếu.',
                'Bấm vào tên khách để xem Customer 360: tổng nợ, quá hạn, lịch sử công nợ.',
              ]}
              tips={[
                'Không cần tạo khách trùng nhiều lần như Excel. Tìm khách trước khi tạo mới.',
                'Với shop nhỏ, có thể chỉ nhập tên và số điện thoại là đủ để bắt đầu.',
              ]}
            />
          </>
        }
      />

      {error ? (
        <Alert severity="error">{error instanceof Error ? error.message : t('loadError')}</Alert>
      ) : null}
      <DataTable
        columns={columns}
        emptyMessage={t('empty')}
        fillHeight
        hrefForPage={(page) => hrefWithPage('/parties', filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize('/parties', filters, pageSize)}
        loading={isLoading}
        page={parties.page}
        pageSize={parties.pageSize}
        rows={parties.items}
        toolbar={<PartyListToolbar activeUsers={activeUsers} />}
        total={parties.total}
      />
    </Page>
  );
}
