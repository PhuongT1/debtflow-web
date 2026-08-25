"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Alert, Box, Typography } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/card";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DetailList } from "@/components/ui/detail-list";
import { MetricGrid, Page, PageHeader, PageSplit } from "@/components/ui/page";
import { SectionCard } from "@/components/ui/section-card";
import { DetailPageSkeleton } from "@/components/skeletons/page-skeleton";
import { requestJson } from "@/lib/api-client";
import { formatMoney } from "@/lib/utils";

type Debt = {
  id: string;
  code: string;
  type: "RECEIVABLE" | "PAYABLE";
  status: "OPEN" | "PARTIAL" | "PAID" | "CANCELLED";
  originalAmount: string | number;
  paidAmount: string | number;
  invoiceNo?: string | null;
  orderNo?: string | null;
  contractNo?: string | null;
  dueDate: string;
  collectionStatus?: string | null;
};

type PartyDetail = {
  id: string;
  code?: string | null;
  name: string;
  phone?: string | null;
  email?: string | null;
  taxCode?: string | null;
  address?: string | null;
  note?: string | null;
  creditLimit?: string | number | null;
  assignedTo?: { name: string } | null;
  debts: Debt[];
};

function remainingAmount(debt: Debt) {
  return Number(debt.originalAmount) - Number(debt.paidAmount);
}

export function PartyDetailClient({ partyId }: { partyId: string }) {
  const partyQuery = useQuery({
    queryKey: ["party", partyId],
    queryFn: () => requestJson<PartyDetail>(`/api/parties/${partyId}`),
  });
  const party = partyQuery.data;
  const metrics = useMemo(() => {
    const debts = party?.debts ?? [];
    const active = debts.filter((debt) => debt.status !== "PAID" && debt.status !== "CANCELLED");
    const receivable = active.filter((debt) => debt.type === "RECEIVABLE").reduce((sum, debt) => sum + remainingAmount(debt), 0);
    const payable = active.filter((debt) => debt.type === "PAYABLE").reduce((sum, debt) => sum + remainingAmount(debt), 0);
    const overdue = active.filter((debt) => new Date(debt.dueDate).getTime() < Date.now()).reduce((sum, debt) => sum + remainingAmount(debt), 0);

    return { receivable, payable, overdue };
  }, [party]);

  if (partyQuery.isLoading) return <DetailPageSkeleton />;
  if (partyQuery.error || !party) {
    return <Alert severity="error">{partyQuery.error instanceof Error ? partyQuery.error.message : "Không thể tải hồ sơ đối tác"}</Alert>;
  }

  const columns: Array<DataTableColumn<Debt>> = [
    {
      key: "code",
      header: "Mã",
      sticky: true,
      render: (debt) => (
        <Box>
          <Typography component="a" href={`/debts/${debt.id}`} sx={{ color: "primary.main", fontSize: 13.5, fontWeight: 750, textDecoration: "none" }}>
            {debt.code}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 11.5 }}>{debt.type === "RECEIVABLE" ? "Phải thu" : "Phải trả"}</Typography>
        </Box>
      ),
    },
    { key: "document", header: "Chứng từ", render: (debt) => debt.invoiceNo ?? debt.orderNo ?? debt.contractNo ?? "-" },
    { key: "remaining", header: "Còn lại", align: "right", render: (debt) => formatMoney(remainingAmount(debt)) },
    { key: "dueDate", header: "Hạn", render: (debt) => new Date(debt.dueDate).toLocaleDateString("vi-VN") },
    { key: "status", header: "Trạng thái", render: (debt) => <Badge tone={debt.status === "PAID" ? "green" : debt.status === "CANCELLED" ? "slate" : "amber"}>{debt.status}</Badge> },
  ];

  return (
    <Page>
      <PageHeader
        badge={<Badge tone="green">Đang hoạt động</Badge>}
        description={`${party.code ?? "Chưa có mã"} · Sale phụ trách: ${party.assignedTo?.name ?? "Chưa gán"}`}
        parent="Khách hàng / Nhà cung cấp"
        parentHref="/parties"
        title={party.name}
      />

      <MetricGrid columns={5}>
        <StatCard icon="debts" label="Còn phải thu" value={formatMoney(metrics.receivable)} />
        <StatCard icon="download" label="Còn phải trả" tone="amber" value={formatMoney(metrics.payable)} />
        <StatCard icon="calendar" label="Quá hạn" tone="red" value={formatMoney(metrics.overdue)} />
        <StatCard icon="aging" label="Hạn mức" value={party.creditLimit ? formatMoney(party.creditLimit) : "Chưa đặt"} />
        <StatCard icon="list" label="Số khoản CN" tone="green" value={String(party.debts.length)} />
      </MetricGrid>

      <PageSplit
        aside={
          <SectionCard description="Thông tin hồ sơ và đầu mối liên lạc" title="Thông tin liên hệ">
            <DetailList items={[
              { label: "Điện thoại", value: party.phone },
              { label: "Email", value: party.email },
              { label: "Mã số thuế", value: party.taxCode },
              { label: "Địa chỉ", value: party.address },
              { label: "Ghi chú", value: party.note },
            ]} />
          </SectionCard>
        }
      >
        <DataTable
          columns={columns}
          emptyMessage="Đối tác này chưa có công nợ"
          hrefForPage={(page) => `/parties/${party.id}?page=${page}`}
          page={1}
          pageSize={party.debts.length || 20}
          pagination={false}
          rows={party.debts}
          title="Công nợ của đối tác"
          total={party.debts.length}
        />
      </PageSplit>
    </Page>
  );
}
