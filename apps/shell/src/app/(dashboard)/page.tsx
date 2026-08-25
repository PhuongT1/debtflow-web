import Link from "next/link";
import { Typography } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { HelpModal } from "@/components/ui/help-modal";
import { MetricGrid, Page, PageGrid, PageHeader } from "@/components/ui/page";
import { SectionCard } from "@/components/ui/section-card";
import { getDashboard } from "@/features/dashboard/service";
import { API_URL } from "@/lib/env";
import { formatMoney } from "@/lib/utils";

export default async function DashboardPage() {
  const dashboard = await getDashboard();
  const topDebtColumns: Array<DataTableColumn<(typeof dashboard.topDebts)[number]>> = [
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
    { key: "remaining", header: "Còn lại", align: "right", render: (debt) => formatMoney(debt.originalAmount.minus(debt.paidAmount)) },
    { key: "dueDate", header: "Hạn", render: (debt) => debt.dueDate.toLocaleDateString("vi-VN") },
  ];

  return (
    <Page>
      <PageHeader
        title="Dashboard công nợ"
        description="Tổng quan phải thu, phải trả, quá hạn và thanh toán mới nhất."
        actions={
          <>
          <HelpModal
            title="Dashboard dùng để làm gì?"
            description="Đây là màn hình xem nhanh hôm nay cần thu ai, còn nợ bao nhiêu và khoản nào đang nguy hiểm."
            steps={[
              "Nhìn ô Còn phải thu để biết tổng tiền khách còn nợ shop/công ty.",
              "Nhìn ô Nợ quá hạn để biết có bao nhiêu khoản đã trễ hạn.",
              "Xem Khoản cần xử lý, bấm vào mã công nợ để gọi khách hoặc ghi nhận thanh toán.",
              "Cuối ngày export Excel nếu cần gửi sếp hoặc lưu báo cáo.",
            ]}
            tips={[
              "Sale chỉ cần mở dashboard mỗi sáng và xử lý từ khoản quá hạn trước.",
              "Nếu thấy khách hẹn trả, vào chi tiết công nợ đặt ngày follow-up để hệ thống nhắc lại.",
            ]}
          />
          <Button component={Link} href={`${API_URL}/exports/debts`}>
            Export Excel
          </Button>
          </>
        }
      />

      <MetricGrid>
        <StatCard icon="debts" label="Còn phải thu" value={formatMoney(dashboard.receivable.remaining)} hint={`Tổng ${formatMoney(dashboard.receivable.original)}`} tone="blue" />
        <StatCard icon="payments" label="Đã thu" value={formatMoney(dashboard.receivable.paid)} tone="green" />
        <StatCard icon="download" label="Còn phải trả" value={formatMoney(dashboard.payable.remaining)} hint={`Tổng ${formatMoney(dashboard.payable.original)}`} tone="amber" />
        <StatCard icon="calendar" label="Nợ quá hạn" value={String(dashboard.overdueCount)} hint="Khoản chưa tất toán" tone="red" />
      </MetricGrid>

      <PageGrid>
          <DataTable
            title="Khoản cần xử lý"
            columns={topDebtColumns}
            emptyMessage="Không có khoản cần xử lý"
            hrefForPage={() => "/"}
            page={1}
            pageSize={Math.max(1, dashboard.topDebts.length || 8)}
            pagination={false}
            rows={dashboard.topDebts}
            total={dashboard.topDebts.length}
          />
        <SectionCard title="Thanh toán gần đây" description="Các giao dịch vừa được ghi nhận">
          <div className="grid gap-3">
            {dashboard.recentPayments.length === 0 ? (
              <div className="grid min-h-40 place-items-center rounded-lg border border-border text-center">
                <div>
                  <Typography sx={{ fontWeight: 700 }}>Chưa có thanh toán</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Khi khách trả tiền, lịch sử mới nhất sẽ hiện ở đây.
                  </Typography>
                </div>
              </div>
            ) : (
              dashboard.recentPayments.map((payment) => (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3" key={payment.id}>
                  <div>
                    <p className="font-semibold">{payment.debt.party.name}</p>
                    <p className="text-sm text-slate-500">{payment.paidAt.toLocaleDateString("vi-VN")}</p>
                  </div>
                  <Badge tone="green">{formatMoney(payment.amount)}</Badge>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </PageGrid>
    </Page>
  );
}
