import type { DataTableColumn } from '@/components/ui/data-table';

type PartyColumnConfig = Omit<DataTableColumn<never>, 'render'>;
export type PartyTableHeaders = Record<
  'name' | 'type' | 'sale' | 'contact' | 'receivable' | 'payable' | 'actions',
  string
>;

export function getPartyTableColumns(headers: PartyTableHeaders) {
  return {
    name: {
      key: 'name',
      header: headers.name,
      skeleton: { items: [{ width: 178 }, { width: 72 }] },
      sticky: true,
      width: 260,
    },
    type: {
      key: 'type',
      header: headers.type,
      skeleton: { items: [{ height: 24, width: 88 }] },
    },
    sale: {
      key: 'sale',
      header: headers.sale,
      skeleton: { items: [{ width: 54 }] },
    },
    contact: {
      key: 'contact',
      header: headers.contact,
      skeleton: { items: [{ width: 100 }, { height: 12, width: 180 }] },
    },
    receivable: {
      key: 'receivable',
      header: headers.receivable,
      align: 'right',
      skeleton: { items: [{ width: 104 }] },
      width: 150,
    },
    payable: {
      key: 'payable',
      header: headers.payable,
      align: 'right',
      skeleton: { items: [{ width: 104 }] },
      width: 150,
    },
    actions: {
      key: 'actions',
      header: headers.actions,
      skeleton: {
        direction: 'row',
        items: [
          { height: 28, variant: 'circular', width: 28 },
          { height: 34, width: 72 },
        ],
      },
    },
  } satisfies Record<string, PartyColumnConfig>;
}

export const partyTableColumns = getPartyTableColumns({
  name: 'Tên',
  type: 'Loại',
  sale: 'Sale',
  contact: 'Liên hệ',
  receivable: 'Họ nợ bạn',
  payable: 'Bạn nợ họ',
  actions: 'Thao tác',
});
