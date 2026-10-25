'use client';

import { createContext, useContext } from 'react';
import { TableCell, type SxProps, type TableCellProps, type Theme } from '@mui/material';
import type { FixedTableSide } from './types';

type FixedColumnShadows = { left: boolean; right: boolean };

export const FixedColumnContext = createContext<FixedColumnShadows>({ left: false, right: false });

export type DataTableCellProps = TableCellProps & {
  fixed?: FixedTableSide;
  fixedOffset?: number | string;
};

function getFixedCellSx(
  fixed?: FixedTableSide,
  fixedOffset: number | string = 0,
  showShadow = false,
): SxProps<Theme> | undefined {
  if (!fixed) return undefined;

  return {
    '&.MuiTableCell-head': {
      bgcolor: 'action.hover',
      zIndex: 4,
    },
    bgcolor: 'background.paper',
    boxShadow: showShadow
      ? fixed === 'left'
        ? '2px 0 4px rgba(15, 23, 42, 0.06)'
        : '-2px 0 4px rgba(15, 23, 42, 0.06)'
      : 'none',
    [fixed]: fixedOffset,
    position: 'sticky',
    zIndex: 2,
  };
}

/** A table cell that remains visible while the parent table scrolls horizontally. */
export function DataTableCell({ fixed, fixedOffset, sx, ...props }: DataTableCellProps) {
  const shadows = useContext(FixedColumnContext);

  return (
    <TableCell
      {...props}
      sx={[
        getFixedCellSx(fixed, fixedOffset, fixed === 'left' ? shadows.left : shadows.right),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
