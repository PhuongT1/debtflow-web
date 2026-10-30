'use client';

import { Box, type SxProps, type Theme, useTheme } from '@mui/material';

export type TableLayoutProps = {
  children: React.ReactNode;
  fillAvailable?: boolean;
  footer?: React.ReactNode;
  sx?: SxProps<Theme>;
};

/** Keeps a table's content and optional footer within one bordered surface. */
export function TableLayout({ children, fillAvailable = false, footer, sx }: TableLayoutProps) {
  const theme = useTheme();
  return (
    <Box
      sx={[
        {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          boxShadow: theme.customShadows.surface,
          display: 'flex',
          flex: fillAvailable ? '1 1 0' : undefined,
          flexDirection: 'column',
          minHeight: fillAvailable ? 0 : undefined,
          overflow: 'hidden',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
      {footer ? (
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            flexShrink: 0,
            px: 2.5,
            py: 1,
          }}
        >
          {footer}
        </Box>
      ) : null}
    </Box>
  );
}
