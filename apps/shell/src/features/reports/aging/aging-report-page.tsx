import Link from 'next/link';

import { DataTable, type DataTableColumn } from '@/components/tables';
import { applyTableLayout } from '@/components/tables/page-layouts';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { StatCard } from '@/components/ui/page/card';
import { MetricGrid, Page, PageHeader } from '@/components/ui/page/page';
import { formatMoney } from '@/lib/presentation/formatters';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';
import { getDebtAgingReport, listDebts } from '@/services/debt.server';

export async function AgingReportPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  const [aging, debts] = await Promise.all([
    getDebtAgingReport({ type: 'RECEIVABLE' }),
    listDebts({ ...filters, type: 'RECEIVABLE' }),
  ]);
  const activeDebts = debts.items.filter(
    (debt) => debt.status !== 'PAID' && debt.status !== 'CANCELLED',
  );
  const columns: Array<DataTableColumn<(typeof debts.items)[number]>> = [
    {
      key: 'code',
      title: 'Mã',
      render: (debt) => (
        <Link className="font-semibold text-blue-600" href={`/debts/${debt.id}`}>
          {debt.code}
        </Link>
      ),
    },
    { key: 'party', title: 'Khách hàng', render: (debt) => debt.party.name },
    { key: 'sale', title: 'Sale', render: (debt) => debt.assignedTo?.name ?? '-' },
    {
      key: 'remaining',
      title: 'Còn lại',
      align: 'right',
      render: (debt) => (
        <span className="font-semibold">
          {formatMoney(debt.originalAmount.minus(debt.paidAmount))}
        </span>
      ),
    },
    { key: 'dueDate', title: 'Hạn', render: (debt) => debt.dueDate.toLocaleDateString('vi-VN') },
    {
      key: 'late',
      title: 'Trễ',
      render: (debt) => {
        const lateDays = Math.max(0, Math.floor((Date.now() - debt.dueDate.getTime()) / 86400000));
        return (
          <span className={lateDays > 0 ? 'font-semibold text-red-600' : 'text-slate-500'}>
            {lateDays > 0 ? `${lateDays} ngày` : 'Chưa đến hạn'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Thao tác',
      render: (debt) => (
        <ConfirmActionButton
          endpoint={`/api/debts/${debt.id}`}
          label="Hủy"
          confirmMessage="Bạn chắc chắn muốn hủy công nợ này? Công nợ đã có thanh toán sẽ không hủy được."
        />
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader
        title="Báo cáo tuổi nợ"
        description="Nhìn nhanh khoản nào mới trễ, khoản nào cần ưu tiên xử lý ngay."
        actions={
          <HelpModal
            title="Cách đọc báo cáo tuổi nợ"
            description="Tuổi nợ giúp biết tiền bị kẹt bao lâu. Càng lâu càng cần ưu tiên thu hoặc báo quản lý."
            steps={[
              'Xem nhóm Chưa đến hạn để biết khoản sắp tới hạn.',
              'Xem nhóm 1-7 ngày để nhắc khách sớm, tránh thành nợ xấu.',
              'Xem nhóm 31-60 và trên 60 ngày để escalated hoặc dừng bán thiếu.',
              'Bấm mã công nợ trong bảng để xử lý từng khoản.',
            ]}
            tips={['Shop nhỏ có thể dùng màn hình này thay cho việc tô màu thủ công trong Excel.']}
          />
        }
      />

      <MetricGrid columns={5}>
        {Object.values(aging).map((bucket) => (
          <StatCard
            icon="aging"
            key={bucket.label}
            label={bucket.label}
            value={formatMoney(bucket.amount)}
            hint={`${bucket.count} khoản`}
          />
        ))}
      </MetricGrid>

      <DataTable
        title="Chi tiết công nợ phải thu"
        columns={applyTableLayout(columns, 'aging')}
        tableSx={{ tableLayout: 'fixed' }}
        emptyMessage="Không có công nợ phải thu chưa tất toán"
        fillHeight
        hrefForPage={(page) => hrefWithPage('/reports/aging', filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize('/reports/aging', filters, pageSize)}
        paginationMeta={debts}
        rowKey="id"
        dataSource={activeDebts}
      />
    </Page>
  );
}
