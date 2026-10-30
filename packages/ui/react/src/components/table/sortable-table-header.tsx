'use client';

import { TableSortLabel } from '@mui/material';

import type { SortableTableHeaderProps } from './types';

export function SortableTableHeader({
  active,
  direction,
  href,
  label,
  onClick,
}: SortableTableHeaderProps) {
  const props = href ? { component: 'a' as const, href } : { onClick };

  return (
    <TableSortLabel
      active={active}
      direction={active ? direction : 'asc'}
      {...props}
      sx={{
        '&.Mui-active': { color: 'text.brand' },
        '& .MuiTableSortLabel-icon': {
          color: 'inherit !important',
          flexShrink: 0,
          marginLeft: 0.5,
          marginRight: 0,
          opacity: active ? 1 : 0.4,
        },
        flexDirection: 'row',
        fontWeight: 800,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </TableSortLabel>
  );
}
