import type { SxProps, Theme } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';

import {
  createTablePaginationLinks,
  DataTable as SharedDataTable,
  type DataTableColumn,
  type DataTableSize,
  SortableTableHeader,
  type TableScroll,
} from '@packages/ui-react';

import type { SortDirection } from '@/lib/routing/table-sort';

import { DataTablePagination } from './data-table-pagination';

export type { DataTableColumn, DataTableSkeletonSpec } from '@packages/ui-react';
type TableSlot<Row> = React.ReactNode | ((dataSource: Row[]) => React.ReactNode);

export type DataTableProps<Row> = {
  columns: Array<DataTableColumn<Row>>;
  dataSource: Row[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  footer?: TableSlot<Row>;
  paginationMeta: { page: number; pageSize: number; total: number };
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  sort?: {
    by: string;
    order: SortDirection;
    hrefForSort: (sortBy: string, sortOrder: SortDirection) => string;
  };
  size?: DataTableSize;
  tableSx?: SxProps<Theme>;
  fillHeight?: boolean;
  loading?: boolean;
  pagination?: boolean;
  rowKey?: keyof Row | ((record: Row, index: number) => React.Key);
  scroll?: TableScroll;
  summary?: (currentPageData: Row[]) => React.ReactNode;
  title?: TableSlot<Row>;
  toolbar?: React.ReactNode;
};

export function DataTable<Row>({
  columns,
  dataSource,
  title,
  footer,
  emptyMessage: emptyMessageInput,
  paginationMeta,
  hrefForPage,
  hrefForPageSize,
  sort,
  fillHeight = true,
  loading = false,
  pagination = true,
  size = 'small',
  ...rest
}: DataTableProps<Row>) {
  const locale = useLocale();

  const ui = useTranslations('Workspace');
  const emptyMessage = emptyMessageInput ?? ui('noRecordsFound');

  const links = createTablePaginationLinks({ ...paginationMeta, hrefForPage, hrefForPageSize });
  const renderSlot = (slot?: TableSlot<Row>) =>
    typeof slot === 'function' ? slot(dataSource) : slot;
  return (
    <SharedDataTable
      columns={columns}
      size={size}
      dataSource={dataSource}
      emptyMessage={emptyMessage}
      emptyHint={ui('tryChangingFiltersOrAddingARecord')}
      fillHeight={fillHeight}
      loading={loading}
      skeletonRowCount={Math.min(10, Math.max(5, paginationMeta.pageSize))}
      {...rest}
      title={renderSlot(title)}
      description={ui('recordsCount', { value1: paginationMeta.total.toLocaleString(locale) })}
      footer={renderSlot(footer)}
      renderHeader={(column) =>
        column.sortKey && sort ? (
          <SortableTableHeader
            active={sort.by === column.sortKey}
            direction={sort.order}
            href={sort.hrefForSort(
              column.sortKey,
              sort.by === column.sortKey && sort.order === 'asc' ? 'desc' : 'asc',
            )}
            label={column.title}
          />
        ) : (
          column.title
        )
      }
      pagination={
        pagination ? (
          <DataTablePagination
            page={paginationMeta.page}
            pageSize={paginationMeta.pageSize}
            total={paginationMeta.total}
            {...links}
            loading={loading}
          />
        ) : undefined
      }
    />
  );
}
