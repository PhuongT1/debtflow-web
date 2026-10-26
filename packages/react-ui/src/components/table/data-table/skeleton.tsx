import { Box, TableRow } from '@mui/material';
import { DataTableCell } from '../table-cell';
import type { FixedTableSide } from '../types';
import { getFixedColumnOffset } from '../fixed-column-offset';
import { Skeleton } from '@mui/material';
import type { DataTableSkeletonSpec } from './types';

type SkeletonColumn = {
  key: string;
  align?: 'left' | 'right' | 'center';
  fixed?: FixedTableSide;
  width?: number | string;
  skeleton?: DataTableSkeletonSpec;
};

const widths = [72, 88, 64, 76, 58];

export function DataTableRowsSkeleton({
  columns,
  rowCount = 8,
}: {
  columns: SkeletonColumn[];
  rowCount?: number;
}) {
  return Array.from({ length: rowCount }, (_, rowIndex) => (
    <TableRow aria-hidden key={rowIndex} sx={{ height: 68 }}>
      {columns.map((column, columnIndex) => (
        <DataTableCell
          align={column.align}
          fixed={column.fixed}
          fixedOffset={getFixedColumnOffset(columns, columnIndex, column.fixed)}
          key={column.key}
          sx={{
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
