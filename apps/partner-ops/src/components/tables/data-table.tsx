import { useTranslations } from 'next-intl';

import { createTablePaginationLinks, DataTable as SharedDataTable } from '@packages/ui-react';

import type { DataTableProps } from './data-table.types';
import { DataTablePagination } from './data-table-pagination';

export type { DataTableColumn, DataTableSkeletonSpec } from './data-table.types';

/** Keeps the app's URL, translation and legacy column contracts at its boundary. */
export function DataTable<Row extends { id: React.Key }>({
  columns,
  rows,
  emptyMessage = 'Không có dữ liệu',
  page,
  pageSize,
  total,
  hrefForPage,
  hrefForPageSize,
  fillHeight = true,
  loading = false,
  pagination = true,
  rowKey = 'id',
  ...rest
}: DataTableProps<Row>) {
  const t = useTranslations('Table');
  const meta = { page, pageSize, total };
  const links = createTablePaginationLinks({ ...meta, hrefForPage, hrefForPageSize });
  return (
    <SharedDataTable
      columns={columns.map(({ header, sticky, ...column }) => ({
        ...column,
        title: header,
        fixed: column.fixed ?? (sticky ? 'left' : undefined),
      }))}
      dataSource={rows}
      {...rest}
      rowKey={rowKey}
      description={t('records', { count: total })}
      emptyMessage={emptyMessage}
      emptyHint={t('emptyHint')}
      fillHeight={fillHeight}
      loading={loading}
      pagination={
        pagination ? <DataTablePagination {...links} {...meta} loading={loading} /> : undefined
      }
    />
  );
}
