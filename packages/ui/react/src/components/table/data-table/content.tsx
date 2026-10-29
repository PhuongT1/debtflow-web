import { designTokens } from '@packages/ui-tokens';
import { TableBody, TableFooter, TableHead, TableRow } from '@mui/material';
import { DataTableCell } from '../table-cell';
import { DataTableContainer } from '../table-container';
import { DataTableRowsSkeleton } from './skeleton';
import { DataTableState } from './state';
import { EmptyTableIcon } from './empty-icon';
import { getFixedColumnOffset } from '../fixed-column-offset';
import type { DataTableContentProps } from './types';

/** Table rendering only; data fetching, translations and navigation stay with the consumer. */
export function DataTableContent<Row>({
  columns,
  size = 'medium',
  dataSource,
  emptyMessage,
  emptyHint,
  emptyIcon,
  fillHeight = true,
  loading = false,
  loadingContent,
  skeletonRowCount = 8,
  skeletonRowHeight,
  rowKey,
  scroll,
  tableSx,
  renderHeader,
  summary,
}: DataTableContentProps<Row>) {
  const density = designTokens.table.sizes[size];
  const rowHeight = skeletonRowHeight ?? density.rowHeight;
  const isEmpty = !loading && dataSource.length === 0;
  const fillStateHeight = fillHeight && (isEmpty || (loading && loadingContent != null));
  return (
    <DataTableContainer
      bordered={false}
      containerSx={{
        bgcolor: 'background.paper',
        containerType: 'inline-size',
        flex: fillHeight ? { xs: '0 0 auto', md: '1 1 0' } : undefined,
        minHeight: fillHeight ? { md: 0 } : undefined,
        maxWidth: '100%',
      }}
      scroll={scroll}
      size={size === 'large' ? 'medium' : 'small'}
      sx={[
        {
          bgcolor: 'background.paper',
          height: fillStateHeight ? '100%' : undefined,
        },
        ...(Array.isArray(tableSx) ? tableSx : [tableSx]),
      ]}
    >
      <TableHead>
        <TableRow>
          {columns.map((column, index) => (
            <DataTableCell
              key={column.key}
              align={column.align}
              fixed={column.fixed}
              fixedOffset={getFixedColumnOffset(columns, index, column.fixed)}
              sx={{
                paddingX: `${density.paddingX}px`,
                minWidth: column.width,
                width: column.width,
                whiteSpace: 'nowrap',
              }}
            >
              {renderHeader ? renderHeader(column) : column.title}
            </DataTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          loadingContent != null ? (
            <DataTableState
              columns={columns.length}
              fillHeight={fillHeight}
              message={loadingContent}
            />
          ) : (
            <DataTableRowsSkeleton
              columns={columns}
              rowCount={skeletonRowCount}
              rowHeight={rowHeight}
              size={size}
            />
          )
        ) : dataSource.length === 0 ? (
          <DataTableState
            columns={columns.length}
            fillHeight={fillHeight}
            message={emptyMessage}
            hint={emptyHint}
            icon={emptyIcon === undefined ? <EmptyTableIcon /> : emptyIcon}
          />
        ) : (
          dataSource.map((row, rowIndex) => (
            <TableRow
              hover
              key={
                typeof rowKey === 'function'
                  ? rowKey(row, rowIndex)
                  : rowKey
                    ? String(row[rowKey])
                    : rowIndex
              }
              sx={{
                height: density.rowHeight,
                '&:hover .MuiTableCell-body': { bgcolor: 'action.hover' },
                '&:last-child td': { borderBottom: 0 },
              }}
            >
              {columns.map((column, index) => (
                <DataTableCell
                  key={column.key}
                  align={column.align}
                  fixed={column.fixed}
                  fixedOffset={getFixedColumnOffset(columns, index, column.fixed)}
                  sx={{
                    paddingY: `${density.paddingY}px`,
                    paddingX: `${density.paddingX}px`,
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
  );
}
