import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/card";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DetailList } from "@/components/ui/detail-list";
import { HelpModal } from "@/components/ui/help-modal";
import { MetricGrid, Page, PageHeader, PageSplit } from "@/components/ui/page";
import { SectionCard } from "@/components/ui/section-card";
import { CollectionForm } from "@/features/debts/collection-form";
import { getDebt } from "@/features/debts/service";
import { PaymentForm } from "@/features/payments/payment-form";
import { listUsers } from "@/features/users/service";
import { hrefWithPage, hrefWithPageSize } from "@/lib/pagination";
import { formatMoney } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

export default async function DebtDetailPage({
  params,
  searchParams,
}: Params & {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  const page = Math.max(1, Number(filters.page ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(filters.pageSize ?? 20)));
  const [debt, users] = await Promise.all([
    getDebt((await params).id),
    listUsers(),
  ]);
  const activeUsers = users.filter((user) => user.status === "ACTIVE").sort((a, b) => a.name.localeCompare(b.name));
  const remaining = debt.originalAmount.minus(debt.paidAmount);
  const isOverdue = debt.dueDate < new Date() && remaining.greaterThan(0) && debt.status !== "CANCELLED";
  const payments = debt.payments ?? [];
  const pagedPayments = payments.slice((page - 1) * pageSize, page * pageSize);
  const paymentColumns: Array<DataTableColumn<(typeof payments)[number]>> = [
    { key: "paidAt", header: "Ngày", render: (payment) => payment.paidAt.toLocaleDateString("vi-VN") },
    { key: "amount", header: "Số tiền", align: "right", render: (payment) => <span className="font-semibold">{formatMoney(payment.amount)}</span> },
    { key: "method", header: "Phương thức", render: (payment) => payment.method },
    { key: "referenceNo", header: "Tham chiếu", render: (payment) => payment.referenceNo ?? "-" },
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
    <Page>
      <PageHeader
        actions={<HelpModal
          title="Cách xử lý một khoản công nợ"
          description="Trang này là nơi sale làm việc với một khoản nợ cụ thể: ghi nhận khách trả tiền và đặt lịch nhắc tiếp."
          steps={[
            "Kiểm tra số Còn lại để biết khách còn nợ bao nhiêu.",
            "Nếu khách vừa trả tiền, nhập vào Ghi nhận thanh toán. Hệ thống tự cập nhật còn lại.",
            "Nếu khách chưa trả, cập nhật Trạng thái thu tiền và Hẹn follow-up tiếp theo.",
            "Nếu khách hẹn trả hoặc tranh chấp, ghi rõ vào Ghi chú thu tiền để người khác nắm được.",
          ]}
          tips={[
            "Không ghi đè số tiền gốc. Mọi lần trả tiền nên là một dòng thanh toán riêng.",
            "Khi còn lại bằng 0, trạng thái công nợ tự chuyển sang PAID.",
          ]}
        />}
        badge={<Badge tone={isOverdue ? "red" : debt.status === "PAID" ? "green" : "blue"}>{isOverdue ? "OVERDUE" : debt.status}</Badge>}
        description={debt.title}
        parent="Công nợ"
        parentHref="/debts"
        title={debt.code}
      />

      <MetricGrid>
        <StatCard icon="debts" label="Tổng công nợ" value={formatMoney(debt.originalAmount)} />
        <StatCard icon="payments" label="Đã thanh toán" value={formatMoney(debt.paidAmount)} tone="green" />
        <StatCard icon="aging" label="Còn lại" value={formatMoney(remaining)} tone="amber" />
        <StatCard icon="calendar" label="Ngày đến hạn" value={debt.dueDate.toLocaleDateString("vi-VN")} tone={isOverdue ? "red" : "blue"} />
      </MetricGrid>

      <PageSplit aside={
        <SectionCard title="Ghi nhận thanh toán" description="Thêm giao dịch mới cho khoản công nợ này">
          <PaymentForm debtId={debt.id} remainingAmount={Number(remaining)} />
        </SectionCard>
      } asideWidth={420}>
        <SectionCard title="Thông tin công nợ" description="Chứng từ, phụ trách và lịch theo dõi">
          <DetailList columns={2} items={[
            { label: "Đối tác", value: debt.party.name },
            { label: "Sale phụ trách", value: debt.assignedTo?.name },
            { label: "Chứng từ", value: [debt.invoiceNo, debt.orderNo, debt.contractNo, debt.poNo].filter(Boolean).join(" · ") },
            { label: "Trạng thái thu tiền", value: debt.collectionStatus },
            { label: "Hẹn follow-up", value: debt.nextFollowUpAt?.toLocaleDateString("vi-VN") },
            { label: "Loại", value: debt.type === "RECEIVABLE" ? "Phải thu" : "Phải trả" },
            { label: "Ngày phát sinh", value: debt.issueDate.toLocaleDateString("vi-VN") },
            { label: "Ghi chú thu tiền", value: debt.followUpNote },
            { label: "Mô tả", value: debt.description },
          ]} />
        </SectionCard>
      </PageSplit>

      <SectionCard title="Cập nhật thu tiền / follow-up" description="Quản lý trạng thái và lịch nhắc tiếp theo">
        <CollectionForm
          debtId={debt.id}
          users={activeUsers}
          defaults={{
            assignedToId: debt.assignedToId,
            collectionStatus: debt.collectionStatus,
            nextFollowUpAt: debt.nextFollowUpAt,
            followUpNote: debt.followUpNote,
            invoiceNo: debt.invoiceNo,
            orderNo: debt.orderNo,
            contractNo: debt.contractNo,
            poNo: debt.poNo,
          }}
        />
      </SectionCard>

      <DataTable
          title="Lịch sử thanh toán"
          columns={paymentColumns}
          emptyMessage="Công nợ này chưa có thanh toán"
          hrefForPage={(nextPage) => hrefWithPage(`/debts/${debt.id}`, filters, nextPage)}
          hrefForPageSize={(pageSize) => hrefWithPageSize(`/debts/${debt.id}`, filters, pageSize)}
          page={page}
          pageSize={pageSize}
          rows={pagedPayments}
          total={payments.length}
      />
    </Page>
  );
}
