import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { HelpModal } from "@/components/ui/help-modal";
import { Page, PageHeader } from "@/components/ui/page";
import { listDebts } from "@/features/debts/service";
import { hrefWithPage, hrefWithPageSize } from "@/lib/pagination";
import { formatMoney } from "@/lib/utils";

export default async function OverduePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  const debts = await listDebts({ ...filters, overdue: true });
  const columns: Array<DataTableColumn<(typeof debts.items)[number]>> = [
    {
      key: "code",
      header: "Mã",
      render: (debt) => (
        <Link className="font-semibold text-blue-600" href={`/debts/${debt.id}`}>
          {debt.code}
        </Link>
      ),
    },
    { key: "party", header: "Đối tác", render: (debt) => debt.party.name },
    { key: "type", header: "Loại", render: (debt) => (debt.type === "RECEIVABLE" ? "Phải thu" : "Phải trả") },
    { key: "remaining", header: "Còn lại", align: "right", render: (debt) => formatMoney(debt.originalAmount.minus(debt.paidAmount)) },
    { key: "dueDate", header: "Ngày đến hạn", render: (debt) => debt.dueDate.toLocaleDateString("vi-VN") },
    {
      key: "late",
      header: "Trễ",
      render: (debt) => {
        const lateDays = Math.max(1, Math.ceil((Date.now() - debt.dueDate.getTime()) / 86400000));
        return <Badge tone="red">{lateDays} ngày</Badge>;
      },
    },
    {
      key: "actions",
      header: "Thao tác",
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
      <PageHeader title="Danh sách nợ quá hạn" description="Các khoản đã quá hạn và chưa tất toán." actions={
        <HelpModal
          title="Cách xử lý nợ quá hạn"
          description="Đây là danh sách sale nên mở đầu tiên khi cần thu tiền."
          steps={[
            "Ưu tiên khoản trễ nhiều ngày và số tiền còn lại lớn.",
            "Bấm vào mã công nợ để xem chi tiết khách và ghi chú thu tiền.",
            "Gọi khách, sau đó cập nhật trạng thái: đã liên hệ, khách hẹn trả, tranh chấp hoặc escalated.",
            "Đặt ngày follow-up để không quên gọi lại.",
          ]}
          tips={["Danh sách này chỉ tính khoản chưa PAID và chưa CANCELLED.", "Không cần tự tính ngày trễ như Excel, hệ thống tính sẵn."]}
        />
      } />

      <DataTable
        columns={columns}
        emptyMessage="Không có nợ quá hạn"
        fillHeight
        hrefForPage={(page) => hrefWithPage("/overdue", filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize("/overdue", filters, pageSize)}
        page={debts.page}
        pageSize={debts.pageSize}
        rows={debts.items}
        total={debts.total}
      />
    </Page>
  );
}
