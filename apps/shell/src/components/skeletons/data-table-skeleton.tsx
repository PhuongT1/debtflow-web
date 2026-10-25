import { Box, TableRow } from '@mui/material';
import { DataTableCell, type FixedTableSide } from '@debtflow/react-ui';
import { AppSkeleton } from '@/components/ui/skeleton';
import type { DataTableSkeletonSpec } from '@/components/tables';

type SkeletonColumn = {
  key: string;
  align?: 'left' | 'right' | 'center';
  fixed?: FixedTableSide;
  width?: number | string;
  skeleton?: DataTableSkeletonSpec;
};

const widths = [72, 88, 64, 76, 58];

function getFixedColumnOffset(
  columns: SkeletonColumn[],
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
              <AppSkeleton
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
