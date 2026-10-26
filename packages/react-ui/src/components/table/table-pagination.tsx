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
        flexWrap: 'wrap',
        width: '100%',
        justifyContent: 'space-between',
        minHeight: 58,
      }}
    >
      {summary}
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexShrink: 0,
          gap: 1.5,
          maxWidth: '100%',
          overflowX: 'auto',
          ml: 'auto',
          py: 0.25,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
