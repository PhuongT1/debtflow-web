import { getTranslations } from 'next-intl/server';

import { DataTable, type DataTableColumn } from '@/components/tables';
import { applyTableLayout } from '@/components/tables/page-layouts';
import { Badge } from '@/components/ui/badge';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { Page, PageHeader } from '@/components/ui/page/page';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';
import { listUsers } from '@/services/user.server';

import type { UsersPageProps } from './users-page.types';

export async function UsersPage({ searchParams }: UsersPageProps) {
  const ui = await getTranslations('Workspace');

  const filters = await searchParams;
  const result = await listUsers(filters);
  const { items: users, page, pageSize, total } = result;
  const columns: Array<DataTableColumn<(typeof users)[number]>> = [
    {
      key: 'name',
      title: ui('name'),
      render: (user) => <span className="font-semibold">{user.name}</span>,
    },
    { key: 'email', title: 'Email', render: (user) => user.email },
    {
      key: 'role',
      title: 'Role',
      render: (user) => (
        <Badge
          tone={
            user.role === 'OWNER'
              ? 'green'
              : user.role === 'ADMIN'
                ? 'blue'
                : user.role === 'ACCOUNTANT'
                  ? 'amber'
                  : 'slate'
          }
        >
          {user.role}
        </Badge>
      ),
    },
    { key: 'status', title: ui('status'), render: (user) => user.status },
    {
      key: 'actions',
      title: ui('actions'),
      render: (user) => (
        <ConfirmActionButton
          endpoint={`/api/users/${user.id}`}
          confirmMessage={ui('disableThisUser')}
        />
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader
        title={ui('permissions')}
        description={ui('manageOwnerAdminAccountantAndViewerRoles')}
        actions={
          <HelpModal
            title={ui('understandingPermissions')}
            description={ui('permissionsHelpPreventUnintendedChangesToDebtRecords')}
            steps={[
              ui('adminIsForShopOwnersAndManagersAndCan'),
              ui('accountantCanEnterDebtsRecordPaymentsAndImportExport'),
              ui('viewerCanViewReportsAndLists'),
            ]}
            tips={[ui('thisScreenCurrentlyListsUsersUserCreationAndEditing')]}
          />
        }
      />

      <DataTable
        columns={applyTableLayout(columns, 'users')}
        tableSx={{ tableLayout: 'fixed' }}
        emptyMessage={ui('noUsersFound')}
        fillHeight
        hrefForPage={(nextPage) => hrefWithPage('/users', filters, nextPage)}
        hrefForPageSize={(pageSize) => hrefWithPageSize('/users', filters, pageSize)}
        paginationMeta={{ page, pageSize, total }}
        rowKey="id"
        dataSource={users}
      />
    </Page>
  );
}
