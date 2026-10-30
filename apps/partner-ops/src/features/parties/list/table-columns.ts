import { partnerListLayout } from '@packages/platform-registry';

import type { DataTableColumn } from '@/components/tables';

type PartyColumnConfig = Omit<DataTableColumn<never>, 'render'>;
export type PartyTableHeaders = Record<
  'name' | 'type' | 'sale' | 'contact' | 'receivable' | 'payable' | 'actions',
  string
>;

export function getPartyTableColumns(headers: PartyTableHeaders) {
  const columns = partnerListLayout.columns;
  return {
    name: { ...columns.name, header: headers.name },
    type: { ...columns.type, header: headers.type },
    sale: { ...columns.sale, header: headers.sale },
    contact: { ...columns.contact, header: headers.contact },
    receivable: { ...columns.receivable, header: headers.receivable },
    payable: { ...columns.payable, header: headers.payable },
    actions: { ...columns.actions, header: headers.actions },
  } satisfies Record<string, PartyColumnConfig>;
}
