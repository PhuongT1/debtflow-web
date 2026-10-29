import { designTokens } from '@packages/ui-tokens';
import { Box, TableRow } from '@mui/material';
import { DataTableCell } from '../table-cell';
import { getFixedColumnOffset } from '../fixed-column-offset';
import { Skeleton } from '@mui/material';
import type { DataTableRowsSkeletonProps } from './types';

const widths = [72, 88, 64, 76, 58];

export function DataTableRowsSkeleton({
  columns,
  rowCount = 8,
  rowHeight,
  size = 'medium',
}: DataTableRowsSkeletonProps) {
  const density = designTokens.table.sizes[size];
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <TableRow aria-hidden key={rowIndex} sx={{ height: rowHeight ?? density.rowHeight }}>
      {columns.map((column, columnIndex) => (
        <DataTableCell
          align={column.align}
          fixed={column.fixed}
          fixedOffset={getFixedColumnOffset(columns, columnIndex, column.fixed)}
          key={column.key}
          sx={{
            paddingY: `${density.paddingY}px`,
            paddingX: `${density.paddingX}px`,
            minWidth: column.width,
            width: column.width,
          }}
        >
          <Box
            sx={{
              alignItems:
                column.skeleton?.direction === 'row'
                  ? 'center'
                  : column.align === 'right'
                    ? 'flex-end'
                    : column.align === 'center'
                      ? 'center'
                      : 'flex-start',
              display: 'flex',
              flexDirection: column.skeleton?.direction ?? 'column',
              gap: column.skeleton?.direction === 'row' ? 1 : 0.75,
              justifyContent:
                column.align === 'right'
                  ? 'flex-end'
                  : column.align === 'center'
                    ? 'center'
                    : 'flex-start',
            }}
          >
            {(
              column.skeleton?.items ?? [
                { height: 14, width: `${widths[(rowIndex + columnIndex) % widths.length]}%` },
              ]
            ).map((item, itemIndex) => (
              <Skeleton
                animation="wave"
                height={item.height ?? 14}
                key={itemIndex}
                variant={item.variant ?? 'rounded'}
                width={item.width}
              />
            ))}
          </Box>
        </DataTableCell>
      ))}
    </TableRow>
  ));
}
