import { Box, Paper, TableBody, TableFooter, TableHead, TableRow, Typography } from '@mui/material';
import {
  DataTableCell,
  DataTableContainer,
  type FixedTableSide,
  type TableScroll,
} from '@debtflow/react-ui';
import { AppIcon } from '@/components/ui/app-icon';
import { SortableTableHeader } from '@/components/ui/sortable-table-header';
import type { SortDirection } from '@/lib/routing/table-sort';
import { DataTablePagination } from './data-table-pagination';
import { DataTableRowsSkeleton } from '@/components/skeletons/data-table-skeleton';

export type DataTableColumn<Row> = {
  key: string;
  title: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Keeps the column visible during horizontal scrolling. Fixed columns require a width. */
  fixed?: FixedTableSide;
  width?: number | string;
  /** Server-recognised field. A column is sortable only when the table also receives sort config. */
  sortKey?: string;
  skeleton?: DataTableSkeletonSpec;
  render: (row: Row) => React.ReactNode;
};

type TableSlot<Row> = React.ReactNode | ((dataSource: Row[]) => React.ReactNode);

function getFixedColumnOffset<Row>(
  columns: Array<DataTableColumn<Row>>,
  columnIndex: number,
  fixed?: FixedTableSide,
) {
  if (!fixed) return undefined;

  const fixedColumns =
    fixed === 'left' ? columns.slice(0, columnIndex) : columns.slice(columnIndex + 1);
  const widths = fixedColumns
    .filter((column) => column.fixed === fixed && column.width != null)
    .map((column) => (typeof column.width === 'number' ? `${column.width}px` : column.width));

  return widths.length === 0 ? 0 : `calc(${widths.join(' + ')})`;
}

export type DataTableSkeletonSpec = {
  direction?: 'row' | 'column';
  items: Array<{
    height?: number;
    variant?: 'circular' | 'rounded';
    width: number | string;
  }>;
};

type DataTableProps<Row> = {
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

function renderTableSlot<Row>(slot: TableSlot<Row> | undefined, dataSource: Row[]) {
  return typeof slot === 'function' ? slot(dataSource) : slot;
}

function getRowKey<Row>(record: Row, index: number, rowKey?: DataTableProps<Row>['rowKey']) {
  if (typeof rowKey === 'function') return rowKey(record, index);
  return rowKey ? String(record[rowKey]) : index;
}

export function DataTable<Row>({
  title,
  columns,
  dataSource,
  emptyMessage = 'Không có dữ liệu',
  footer,
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
  const { page, pageSize, total } = paginationMeta;
  const showTableState = loading || dataSource.length === 0;
  const titleContent = renderTableSlot(title, dataSource);
  const footerContent = renderTableSlot(footer, dataSource);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginationTargetPages = [
    1,
    totalPages,
    page - 2,
    page - 1,
    page,
    page + 1,
    page + 2,
  ].filter(
    (candidate, index, candidates) =>
      candidate >= 1 && candidate <= totalPages && candidates.indexOf(candidate) === index,
  );
  const hrefByPage = Object.fromEntries(
    paginationTargetPages.map((candidate) => [candidate, hrefForPage(candidate)]),
  );
  const pageSizeOptions = hrefForPageSize
    ? [10, 20, 30, 50, 100].map((size) => ({ size, href: hrefForPageSize(size) }))
    : [];

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '8px',
        boxShadow: 'none',
        display: 'flex',
        flex: fillHeight ? { xs: '0 0 auto', md: '1 1 0' } : undefined,
        flexDirection: 'column',
        minHeight: fillHeight ? { md: 0 } : undefined,
        overflow: 'hidden',
      }}
    >
      {titleContent ? (
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            px: { xs: 2, sm: 2.5 },
            py: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{titleContent}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12, mt: 0.25 }}>
              {total.toLocaleString('vi-VN')} bản ghi
            </Typography>
          </Box>
        </Box>
      ) : null}
      {toolbar ? (
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            p: { xs: 1.25, sm: 1.5 },
          }}
        >
          {toolbar}
        </Box>
      ) : null}
      <DataTableContainer
        bordered={false}
        containerSx={{
          flex: fillHeight ? { xs: '0 0 auto', md: '1 1 0' } : undefined,
          maxWidth: '100%',
          minHeight: fillHeight ? { md: 0 } : undefined,
        }}
        minWidth={860}
        scroll={scroll}
        size="small"
        sx={{ height: fillHeight && showTableState ? '100%' : undefined }}
      >
        <TableHead>
          <TableRow>
            {columns.map((column, columnIndex) => (
              <DataTableCell
                key={column.key}
                align={column.align}
                fixed={column.fixed}
                fixedOffset={getFixedColumnOffset(columns, columnIndex, column.fixed)}
                sx={{
                  minWidth: column.width,
                  whiteSpace: 'nowrap',
                  width: column.width,
                }}
              >
                {column.sortKey && sort ? (
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
                )}
              </DataTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <DataTableRowsSkeleton
              columns={columns}
              rowCount={Math.min(10, Math.max(5, pageSize))}
            />
          ) : dataSource.length === 0 ? (
            <TableRow sx={{ height: fillHeight ? '100%' : undefined }}>
              <DataTableCell colSpan={columns.length} sx={{ borderBottom: 0 }}>
                <Box
                  sx={{
                    alignContent: 'center',
                    color: 'text.secondary',
                    display: 'grid',
                    justifyItems: 'center',
                    minHeight: fillHeight ? 0 : 200,
                    textAlign: 'center',
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: 'action.hover',
                      borderRadius: '50%',
                      display: 'grid',
                      height: 48,
                      mb: 1.5,
                      placeItems: 'center',
                      width: 48,
                    }}
                  >
                    <AppIcon name="list" />
                  </Box>
                  <Typography sx={{ fontWeight: 750 }}>{emptyMessage}</Typography>
                  <Typography sx={{ mt: 0.5 }} variant="body2">
                    Thử đổi bộ lọc hoặc tạo dữ liệu mới.
                  </Typography>
                </Box>
              </DataTableCell>
            </TableRow>
          ) : (
            dataSource.map((row, rowIndex) => (
              <TableRow
                hover
                key={getRowKey(row, rowIndex, rowKey)}
                sx={{
                  '&:hover td': { bgcolor: 'action.hover' },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                {columns.map((column, columnIndex) => (
                  <DataTableCell
                    key={column.key}
                    align={column.align}
                    fixed={column.fixed}
                    fixedOffset={getFixedColumnOffset(columns, columnIndex, column.fixed)}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      minWidth: column.width,
                      width: column.width,
                    }}
                  >
                    {column.render(row)}
                  </DataTableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        {summary ? <TableFooter>{summary(dataSource)}</TableFooter> : null}
      </DataTableContainer>
      {footerContent ? <Box sx={{ flexShrink: 0, px: 2.5, py: 1.5 }}>{footerContent}</Box> : null}
      {pagination ? (
        <DataTablePagination
          hrefByPage={hrefByPage}
          pageSizeOptions={pageSizeOptions}
          page={page}
          pageSize={pageSize}
          total={total}
          loading={loading}
        />
      ) : null}
    </Paper>
  );
}
