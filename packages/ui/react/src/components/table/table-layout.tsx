'use client';

import { designTokens } from '@packages/ui-tokens';
import { Box, type SxProps, type Theme } from '@mui/material';

export type TableLayoutProps = {
  children: React.ReactNode;
  fillAvailable?: boolean;
  footer?: React.ReactNode;
  sx?: SxProps<Theme>;
};

/** Keeps a table's content and optional footer within one bordered surface. */
export function TableLayout({ children, fillAvailable = false, footer, sx }: TableLayoutProps) {
  return (
    <Box
      sx={[
        {
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${designTokens.radius.lg}px`,
          boxShadow: designTokens.shadow.surface,
          display: 'flex',
          flex: fillAvailable ? { xs: '0 0 auto', md: '1 1 0' } : undefined,
          flexDirection: 'column',
          minHeight: fillAvailable ? { md: 0 } : undefined,
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
