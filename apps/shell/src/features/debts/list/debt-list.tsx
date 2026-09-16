import { getTranslations } from 'next-intl/server';
import { DataTable } from '@/components/ui/data-table';
import { getCatalogOptions } from '@/services/catalog.server';
import { getDebtListColumns } from './columns';
import { DebtListToolbar } from './toolbar';
import { listDebts } from '@/services/debt.server';
import { hrefWithPage, hrefWithPageSize } from '@/lib/routing/pagination';

export async function DebtList({
  filters,
  users,
}: {
  filters: Record<string, string | undefined>;
  users: Array<{ id: string; name: string }>;
}) {
  const [debts, catalog, t] = await Promise.all([
    listDebts(filters),
    getCatalogOptions(),
    getTranslations('Debts'),
  ]);
  return (
    <DataTable
      columns={getDebtListColumns(t)}
      emptyMessage={t('empty')}
      fillHeight
      hrefForPage={(page) => hrefWithPage('/debts', filters, page)}
      hrefForPageSize={(pageSize) => hrefWithPageSize('/debts', filters, pageSize)}
      paginationMeta={debts}
      rows={debts.items}
      toolbar={<DebtListToolbar activeUsers={users} catalog={catalog} filters={filters} />}
    />
  );
}
