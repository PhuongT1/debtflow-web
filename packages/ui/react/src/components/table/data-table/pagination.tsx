import { Box, Skeleton } from '@mui/material';
import type { ReactNode } from 'react';

import { TablePaginationBar } from '../table-pagination';

export interface DataTablePaginationProps {
  children: ReactNode;
  summary: ReactNode;
  loading?: boolean;
}

/** Presentation shared by URL-driven and callback-driven pagination adapters. */
export function DataTablePagination({
  children,
  summary,
  loading = false,
}: DataTablePaginationProps) {
  return loading ? (
    <Box
      aria-hidden
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        gap: 1.5,
        minHeight: 58,
      }}
    >
      <Skeleton animation="wave" height={18} variant="rounded" width={150} />
      <Skeleton animation="wave" height={32} variant="rounded" width={220} />
    </Box>
  ) : (
    <TablePaginationBar summary={summary}>{children}</TablePaginationBar>
  );
}
