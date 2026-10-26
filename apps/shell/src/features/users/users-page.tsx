import { Badge } from '@/components/ui/badge';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { DataTable, type DataTableColumn } from '@/components/tables';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { Page, PageHeader } from '@/components/ui/page/page';
import { listUsers } from '@/services/user.server';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';

export async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  const result = await listUsers(filters);
  const { items: users, page, pageSize, total } = result;
  const columns: Array<DataTableColumn<(typeof users)[number]>> = [
    {
      key: 'name',
      title: 'Tên',
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
    { key: 'status', title: 'Trạng thái', render: (user) => user.status },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (user) => (
        <ConfirmActionButton
          endpoint={`/api/users/${user.id}`}
          confirmMessage="Bạn chắc chắn muốn vô hiệu hóa user này?"
        />
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader
        title="Phân quyền"
        description="Quản lý vai trò OWNER, ADMIN, ACCOUNTANT và VIEWER."
        actions={
          <HelpModal
            title="Cách hiểu phân quyền"
            description="Phân quyền giúp tránh sửa nhầm dữ liệu công nợ."
            steps={[
              'ADMIN dùng cho chủ shop/quản lý, có quyền hủy công nợ.',
              'ACCOUNTANT dùng cho người nhập công nợ, ghi nhận thanh toán, import/export.',
              'VIEWER chỉ xem báo cáo và danh sách, phù hợp cho người cần theo dõi.',
            ]}
            tips={[
              'Hiện màn hình này mới xem danh sách user. Chức năng tạo/sửa user nên làm tiếp ở phase sau.',
            ]}
          />
        }
      />

      <DataTable
        columns={columns}
        emptyMessage="Không có user"
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
