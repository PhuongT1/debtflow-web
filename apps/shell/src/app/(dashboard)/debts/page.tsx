import Link from "next/link";
import { Box, MenuItem } from "@mui/material";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmActionButton } from "@/components/ui/confirm-action-button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DataTableToolbar } from "@/components/ui/data-table-toolbar";
import { FilterActions } from "@/components/ui/filter-actions";
import { FormDialog } from "@/components/ui/form-dialog";
import { AppInput } from "@/components/ui/input";
import { AppSelect } from "@/components/ui/select";
import { HelpModal } from "@/components/ui/help-modal";
import { Page, PageHeader } from "@/components/ui/page";
import { SectionCard } from "@/components/ui/section-card";
import { DebtForm } from "@/features/debts/debt-form";
import { listDebts } from "@/features/debts/service";
import { listParties } from "@/features/debts/party-options-service";
import { listUserOptions } from "@/features/users/service";
import { CollectionStatus, DebtStatus, DebtType } from "@/lib/domain";
import { API_URL } from "@/lib/env";
import { hrefWithPage, hrefWithPageSize } from "@/lib/pagination";
import { formatMoney } from "@/lib/utils";

const statusTone: Record<DebtStatus, "slate" | "blue" | "amber" | "green" | "red"> = {
  OPEN: "blue",
  PARTIAL: "amber",
  PAID: "green",
  CANCELLED: "red",
};

const typeLabel: Record<DebtType, string> = {
  RECEIVABLE: "Phải thu",
  PAYABLE: "Phải trả",
};

const collectionLabel: Record<CollectionStatus, string> = {
  NEW: "Mới",
  CONTACTED: "Đã liên hệ",
  PROMISED: "Khách hẹn trả",
  DISPUTED: "Tranh chấp",
  ESCALATED: "Escalated",
};

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA");
const shortDateFormatter = new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" });
const weekdayFormatter = new Intl.DateTimeFormat("vi-VN", { weekday: "short" });

function getDueDayGroups(debts: Awaited<ReturnType<typeof listDebts>>["items"]) {
  const groups = new Map<string, { date: Date; count: number; amount: number }>();

  debts
    .filter((debt) => debt.status !== DebtStatus.PAID && debt.status !== DebtStatus.CANCELLED)
    .forEach((debt) => {
      const key = dateKeyFormatter.format(debt.dueDate);
      const current = groups.get(key) ?? { date: debt.dueDate, count: 0, amount: 0 };
      current.count += 1;
      current.amount += Number(debt.originalAmount.minus(debt.paidAmount));
      groups.set(key, current);
    });

  return Array.from(groups.values()).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 7);
}

export default async function DebtsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const filters = await searchParams;
  const [debts, parties, users] = await Promise.all([
    listDebts(filters),
    listParties({ pageSize: 100 }),
    listUserOptions(),
  ]);
  const activeUsers = users.filter((user) => user.status === "ACTIVE").sort((a, b) => a.name.localeCompare(b.name));
  const dueDayGroups = getDueDayGroups(debts.items);
  const exportHref = `${API_URL}/exports/debts?${new URLSearchParams(Object.entries(filters).filter(([, value]) => Boolean(value)) as Array<[string, string]>).toString()}`;
  const columns: Array<DataTableColumn<(typeof debts.items)[number]>> = [
    {
      key: "code",
      header: "Mã",
      render: (debt) => (
        <div>
          <Link className="font-semibold text-blue-600" href={`/debts/${debt.id}`}>
            {debt.code}
          </Link>
          <div className="mt-1">
            <Badge tone={statusTone[debt.status]}>{debt.status}</Badge>
          </div>
        </div>
      ),
    },
    {
      key: "party",
      header: "Đối tác",
      render: (debt) => (
        <a className="font-semibold text-slate-900" href={`/parties/${debt.partyId}`}>
          {debt.party.name}
        </a>
      ),
    },
    {
      key: "document",
      header: "Chứng từ",
      render: (debt) => (
        <div>
          <p>{debt.invoiceNo ?? debt.orderNo ?? "-"}</p>
          <p className="text-xs text-slate-500">{debt.contractNo ?? debt.poNo ?? ""}</p>
        </div>
      ),
    },
    { key: "sale", header: "Sale", render: (debt) => debt.assignedTo?.name ?? "-" },
    { key: "type", header: "Loại", render: (debt) => typeLabel[debt.type] },
    {
      key: "remaining",
      header: "Số dư",
      align: "right",
      render: (debt) => <span className="font-semibold">{formatMoney(debt.originalAmount.minus(debt.paidAmount))}</span>,
    },
    {
      key: "dueDate",
      header: "Hạn",
      render: (debt) => {
        const lateDays = Math.floor((Date.now() - debt.dueDate.getTime()) / 86400000);

        return (
          <div>
            <p>{debt.dueDate.toLocaleDateString("vi-VN")}</p>
            {lateDays > 0 && debt.status !== "PAID" ? <p className="text-xs font-semibold text-red-600">Trễ {lateDays} ngày</p> : null}
          </div>
        );
      },
    },
    {
      key: "collection",
      header: "Thu tiền",
      render: (debt) => (
        <div>
          <Badge tone={debt.collectionStatus === "ESCALATED" || debt.collectionStatus === "DISPUTED" ? "red" : debt.collectionStatus === "PROMISED" ? "amber" : "slate"}>
            {collectionLabel[debt.collectionStatus]}
          </Badge>
          {debt.nextFollowUpAt ? <p className="mt-1 text-xs text-slate-500">Hẹn {debt.nextFollowUpAt.toLocaleDateString("vi-VN")}</p> : null}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      render: (debt) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Button component={Link} href={`/debts/${debt.id}`} variant="secondary">
            Chi tiết / Thu tiền
          </Button>
          <ConfirmActionButton
            endpoint={`/api/debts/${debt.id}`}
            label="Hủy"
            confirmMessage="Bạn chắc chắn muốn hủy công nợ này? Công nợ đã có thanh toán sẽ không hủy được."
          />
        </Box>
      ),
    },
  ];

  return (
    <Page fillAvailable>
      <PageHeader
        title="Công nợ"
        description="Tạo và theo dõi công nợ phải thu, phải trả."
        actions={
          <>
          <FormDialog buttonLabel="Tạo công nợ" description="Tạo khoản phải thu/phải trả mới." title="Tạo công nợ">
            <DebtForm parties={parties.items.map((party) => ({ id: party.id, name: party.name }))} users={activeUsers} />
          </FormDialog>
          <HelpModal
            title="Cách quản lý công nợ"
            description="Mỗi khoản bán thiếu hoặc khoản mình cần trả nên là một công nợ riêng để theo dõi rõ ràng."
            steps={[
              "Chọn khách hàng, chọn loại Phải thu nếu khách nợ mình hoặc Phải trả nếu mình nợ nhà cung cấp.",
              "Nhập số tiền, ngày phát sinh, ngày đến hạn và mã hóa đơn/đơn hàng nếu có.",
              "Gán sale phụ trách và đặt ngày follow-up nếu cần gọi khách nhắc thanh toán.",
              "Sau khi khách trả một phần, vào chi tiết công nợ để ghi nhận thanh toán.",
            ]}
            tips={[
              "Dùng bộ lọc để xem riêng công nợ của từng sale hoặc các khoản quá hạn lâu.",
              "Nếu khách đang tranh chấp, chuyển trạng thái thu tiền sang Tranh chấp để manager dễ thấy.",
            ]}
          />
          <Button component={Link} href={exportHref} variant="secondary">
            Export Excel
          </Button>
          </>
        }
      />

      {dueDayGroups.length > 0 ? (
        <SectionCard title="Công nợ theo ngày đến hạn" description="Chọn một ngày để tập trung xử lý các khoản sắp tới hạn.">
          <div className="flex flex-wrap gap-2">
            {dueDayGroups.map((group) => {
              const href = `/debts?dueDate=${dateKeyFormatter.format(group.date)}`;
              return (
                <Link
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                  href={href}
                  key={dateKeyFormatter.format(group.date)}
                >
                  <p className="text-xs font-bold uppercase text-slate-500">{weekdayFormatter.format(group.date)}</p>
                  <p className="text-lg font-black text-slate-950">{shortDateFormatter.format(group.date)}</p>
                  <p className="text-xs font-semibold text-slate-500">
                    {group.count} khoản · {formatMoney(group.amount)}
                  </p>
                </Link>
              );
            })}
          </div>
        </SectionCard>
      ) : null}

      <DataTable
        title="Danh sách công nợ"
        columns={columns}
        emptyMessage="Không có công nợ nào"
        fillHeight
        hrefForPage={(page) => hrefWithPage("/debts", filters, page)}
        hrefForPageSize={(pageSize) => hrefWithPageSize("/debts", filters, pageSize)}
        page={debts.page}
        pageSize={debts.pageSize}
        rows={debts.items}
        toolbar={
          <DataTableToolbar columns={{ xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))", xl: "2fr repeat(7, minmax(110px, 1fr)) auto" }}>
          <AppInput defaultValue={filters.q ?? ""} label="Tìm nhanh" name="q" placeholder="Mã CN, hóa đơn, khách, PO..." />
          <AppSelect defaultValue={filters.type ?? ""} label="Loại" name="type">
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="RECEIVABLE">Phải thu</MenuItem>
            <MenuItem value="PAYABLE">Phải trả</MenuItem>
          </AppSelect>
          <AppSelect defaultValue={filters.status ?? ""} label="Trạng thái" name="status">
            <MenuItem value="">Tất cả</MenuItem>
              {Object.values(DebtStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
          </AppSelect>
          <AppSelect defaultValue={filters.collectionStatus ?? ""} label="Thu tiền" name="collectionStatus">
            <MenuItem value="">Tất cả</MenuItem>
              {Object.values(CollectionStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {collectionLabel[status]}
                </MenuItem>
              ))}
          </AppSelect>
          <AppSelect defaultValue={filters.assignedToId ?? ""} label="Sale" name="assignedToId">
            <MenuItem value="">Tất cả</MenuItem>
              {activeUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
          </AppSelect>
          <AppSelect defaultValue={filters.aging ?? ""} label="Tuổi nợ" name="aging">
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="not_due">Chưa đến hạn</MenuItem>
            <MenuItem value="1_7">Quá hạn 1-7 ngày</MenuItem>
            <MenuItem value="8_30">Quá hạn 8-30 ngày</MenuItem>
            <MenuItem value="31_60">Quá hạn 31-60 ngày</MenuItem>
            <MenuItem value="60_plus">Quá hạn trên 60 ngày</MenuItem>
          </AppSelect>
          <AppSelect defaultValue={filters.followUp ?? ""} label="Follow-up" name="followUp">
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="overdue">Đã trễ hẹn</MenuItem>
            <MenuItem value="today">Hôm nay</MenuItem>
            <MenuItem value="upcoming">Sắp tới</MenuItem>
          </AppSelect>
          <AppSelect defaultValue={filters.dueRange ?? ""} label="Ngày hạn" name="dueRange">
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="today">Hôm nay</MenuItem>
            <MenuItem value="tomorrow">Ngày mai</MenuItem>
            <MenuItem value="next_7_days">7 ngày tới</MenuItem>
            <MenuItem value="this_month">Tháng này</MenuItem>
          </AppSelect>
          <FilterActions resetHref="/debts" />
          </DataTableToolbar>
        }
        total={debts.total}
      />
    </Page>
  );
}
