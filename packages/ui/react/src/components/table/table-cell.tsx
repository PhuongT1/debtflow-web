'use client';

import { createContext, useContext } from 'react';
import { type SxProps, TableCell, type TableCellProps, type Theme, useTheme } from '@mui/material';

import type { FixedCellStyleOptions, FixedTableSide } from './types';

type FixedColumnShadows = { left: boolean; right: boolean };

export const FixedColumnContext = createContext<FixedColumnShadows>({ left: false, right: false });

export type DataTableCellProps = TableCellProps & {
  fixed?: FixedTableSide;
  fixedOffset?: number | string;
};

function getFixedCellSx({
  theme,
  fixed,
  fixedOffset = 0,
  showShadow = false,
}: FixedCellStyleOptions): SxProps<Theme> | undefined {
  if (!fixed) return undefined;

  return {
    '&.MuiTableCell-head': {
      bgcolor: 'background.inset',
      zIndex: 4,
    },
    bgcolor: 'background.paper',
    boxShadow: {
      xs: 'none',
      sm: showShadow
        ? fixed === 'left'
          ? theme.customShadows.fixedLeft
          : theme.customShadows.fixedRight
        : 'none',
    },
    [fixed]: { xs: 'auto', sm: fixedOffset },
    position: 'sticky',
    zIndex: 2,
  };
}

/** A table cell that remains visible while the parent table scrolls horizontally. */
export function DataTableCell({ fixed, fixedOffset, sx, ...props }: DataTableCellProps) {
  const theme = useTheme();
  const shadows = useContext(FixedColumnContext);

  return (
    <TableCell
      {...props}
      sx={[
        getFixedCellSx({
          theme,
          fixed,
          fixedOffset,
          showShadow: fixed === 'left' ? shadows.left : shadows.right,
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    />
  );
}
