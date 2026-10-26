import { TableBody, TableFooter, TableHead, TableRow } from '@mui/material';
import { DataTableCell } from '../table-cell';
import { DataTableContainer } from '../table-container';
import { DataTableRowsSkeleton } from './skeleton';
import { DataTableState } from './state';
import { getFixedColumnOffset } from '../fixed-column-offset';
import type { DataTableContentProps } from './types';

/** Table rendering only; data fetching, translations and navigation stay with the consumer. */
export function DataTableContent<Row>({
  columns,
  dataSource,
  emptyMessage,
  emptyHint,
  emptyIcon,
  fillHeight = true,
  loading = false,
  loadingContent,
  skeletonRowCount = 8,
  rowKey,
  scroll,
  tableSx,
  renderHeader,
  summary,
}: DataTableContentProps<Row>) {
  const showTableState = loading || dataSource.length === 0;
  return (
    <DataTableContainer
      bordered={false}
      containerSx={{
        bgcolor: 'background.paper',
        flex: fillHeight ? { xs: '0 0 auto', md: '1 1 0' } : undefined,
        minHeight: fillHeight ? { md: 0 } : undefined,
        maxWidth: '100%',
      }}
      scroll={scroll}
      size="small"
      sx={[
        { bgcolor: 'background.paper', height: fillHeight && showTableState ? '100%' : undefined },
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
              sx={{ minWidth: column.width, width: column.width, whiteSpace: 'nowrap' }}
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
            <DataTableRowsSkeleton columns={columns} rowCount={skeletonRowCount} />
          )
        ) : dataSource.length === 0 ? (
          <DataTableState
            columns={columns.length}
            fillHeight={fillHeight}
            message={emptyMessage}
            hint={emptyHint}
            icon={emptyIcon}
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
