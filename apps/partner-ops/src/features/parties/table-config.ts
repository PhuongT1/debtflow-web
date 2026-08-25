import type { DataTableColumn } from "@/components/ui/data-table";

type PartyColumnConfig = Omit<DataTableColumn<never>, "render">;

export const partyTableColumns = {
  code: { key: "code", header: "Mã", skeleton: { items: [{ width: 108 }] }, sticky: true, width: 150 },
  name: { key: "name", header: "Tên", skeleton: { items: [{ width: 178 }, { width: 72 }] }, width: 230 },
  type: { key: "type", header: "Loại", skeleton: { items: [{ height: 24, width: 88 }] } },
  sale: { key: "sale", header: "Sale", skeleton: { items: [{ width: 54 }] } },
  createdAt: { key: "createdAt", header: "Ngày tạo", skeleton: { items: [{ width: 82 }, { height: 12, width: 42 }] } },
  creditLimit: { key: "creditLimit", header: "Hạn mức", align: "right", skeleton: { items: [{ width: 104 }] } },
  contact: { key: "contact", header: "Liên hệ", skeleton: { items: [{ width: 100 }, { height: 12, width: 180 }] } },
  debts: { key: "debts", header: "Công nợ", align: "center", skeleton: { items: [{ width: 20 }] } },
  actions: { key: "actions", header: "Thao tác", skeleton: { direction: "row", items: [{ height: 28, variant: "circular", width: 28 }, { height: 34, width: 72 }] } },
} satisfies Record<string, PartyColumnConfig>;
