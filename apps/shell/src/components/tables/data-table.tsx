import {
  DataTable as SharedDataTable,
  createTablePaginationLinks,
  SortableTableHeader,
  type DataTableColumn,
  type TableScroll,
} from '@packages/ui-react';
import { AppIcon } from '@/components/ui/app-icon';
import type { SortDirection } from '@/lib/routing/table-sort';
import { DataTablePagination } from './data-table-pagination';

export type { DataTableColumn, DataTableSkeletonSpec } from '@packages/ui-react';
type TableSlot<Row> = React.ReactNode | ((dataSource: Row[]) => React.ReactNode);

export type DataTableProps<Row> = {
  columns: Array<DataTableColumn<Row>>;
  dataSource: Row[];
  emptyMessage?: string;
  footer?: TableSlot<Row>;
  paginationMeta: { page: number; pageSize: number; total: number };
  hrefForPage: (page: number) => string;
  hrefForPageSize?: (pageSize: number) => string;
  sort?: {
    by: string;
    order: SortDirection;
    hrefForSort: (sortBy: string, sortOrder: SortDirection) => string;
  };
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
  emptyMessage = 'Không có dữ liệu',
  paginationMeta,
  hrefForPage,
  hrefForPageSize,
  sort,
  fillHeight = true,
  loading = false,
  pagination = true,
  rowKey,
  scroll,
  summary,
  toolbar,
}: DataTableProps<Row>) {
  const links = createTablePaginationLinks({ ...paginationMeta, hrefForPage, hrefForPageSize });
  const renderSlot = (slot?: TableSlot<Row>) =>
    typeof slot === 'function' ? slot(dataSource) : slot;
  return (
    <SharedDataTable
      columns={columns}
      dataSource={dataSource}
      emptyMessage={emptyMessage}
      emptyHint="Thử đổi bộ lọc hoặc tạo dữ liệu mới."
      emptyIcon={<AppIcon name="list" />}
      fillHeight={fillHeight}
      loading={loading}
      skeletonRowCount={Math.min(10, Math.max(5, paginationMeta.pageSize))}
      rowKey={rowKey}
      scroll={scroll}
      summary={summary}
      title={renderSlot(title)}
      description={`${paginationMeta.total.toLocaleString('vi-VN')} bản ghi`}
      footer={renderSlot(footer)}
      toolbar={toolbar}
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
