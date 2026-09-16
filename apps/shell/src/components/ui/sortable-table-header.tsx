'use client';

import { TableSortLabel } from '@mui/material';
import type { SortDirection } from '@/lib/routing/table-sort';

export function SortableTableHeader({
  active,
  direction,
  href,
  label,
  onClick,
}: {
  active: boolean;
  direction?: SortDirection;
  href?: string;
  label: React.ReactNode;
  onClick?: () => void;
}) {
  const props = href
    ? { component: 'a' as const, href }
    : { onClick };

  return (
    <TableSortLabel
      active={active}
      direction={active ? direction : 'asc'}
      {...props}
      sx={{
        '&.Mui-active': { color: 'primary.main' },
        '& .MuiTableSortLabel-icon': { color: 'inherit !important', opacity: active ? 1 : 0.4 },
        fontWeight: 800,
      }}
    >
      {label}
    </TableSortLabel>
  );
}
