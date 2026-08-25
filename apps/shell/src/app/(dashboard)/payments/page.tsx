import Link from "next/link";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { HelpModal } from "@/components/ui/help-modal";
import { Page, PageHeader } from "@/components/ui/page";
import { listPayments } from "@/features/payments/service";
import { hrefWithPage, hrefWithPageSize } from "@/lib/pagination";
import { formatMoney } from "@/lib/utils";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  const payments = await listPayments(filters);
  const columns: Array<DataTableColumn<(typeof payments.items)[number]>> = [
    { key: "paidAt", header: "Ngày", render: (payment) => payment.paidAt.toLocaleDateString("vi-VN") },
    {
      key: "debt",
      header: "Mã công nợ",
      render: (payment) => (
        <Link className="font-semibold text-blue-600" href={`/debts/${payment.debtId}`}>
          {payment.debt.code}
        </Link>
      ),
    },
    { key: "party", header: "Đối tác", render: (payment) => payment.debt.party.name },
    { key: "amount", header: "Số tiền", align: "right", render: (payment) => <span className="font-semibold">{formatMoney(payment.amount)}</span> },
    { key: "method", header: "Phương thức", render: (payment) => payment.method },
    { key: "createdBy", header: "Người ghi nhận", render: (payment) => payment.createdBy?.name ?? "-" },
    {
      key: "actions",
      header: "Thao tác",
      render: (payment) => (
        <ConfirmActionButton
          endpoint={`/api/payments/${payment.id}`}
          confirmMessage="Bạn chắc chắn muốn xóa thanh toán này? Số dư công nợ sẽ được tính lại."
        />
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader title="Lịch sử thanh toán" description="Theo dõi các khoản thanh toán một phần hoặc tất toán." actions={
        <HelpModal
          title="Cách xem lịch sử thanh toán"
          description="Màn hình này giống sổ thu tiền, dùng để kiểm tra khách đã trả lúc nào và bằng cách nào."
          steps={[
            "Xem dòng mới nhất ở trên cùng.",
            "Bấm mã công nợ để quay về khoản nợ liên quan.",
            "Kiểm tra phương thức và mã tham chiếu nếu cần đối soát ngân hàng.",
          ]}
          tips={["Mỗi lần khách trả một phần sẽ có một dòng riêng, không bị mất lịch sử."]}
        />
      } />

      <DataTable
        columns={columns}
        emptyMessage="Chưa có lịch sử thanh toán"
        fillHeight
        hrefForPage={(page) => hrefWithPage("/payments", filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize("/payments", filters, pageSize)}
        page={payments.page}
        pageSize={payments.pageSize}
        rows={payments.items}
        total={payments.total}
      />
    </Page>
  );
}
