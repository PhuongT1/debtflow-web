'use client';

import { Box } from '@mui/material';

export type TablePaginationBarProps = {
  children: React.ReactNode;
  summary: React.ReactNode;
};

/** Shared record summary and pagination-control alignment. */
export function TablePaginationBar({ children, summary }: TablePaginationBarProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        gap: 1.5,
        justifyContent: 'space-between',
        minHeight: 58,
      }}
    >
      {summary}
      <Box sx={{ alignItems: 'center', display: 'flex', flexShrink: 0, gap: 1.5 }}>{children}</Box>
    </Box>
  );
}
