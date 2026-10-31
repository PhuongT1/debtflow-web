import { Box } from '@mui/material';

import type { FormActionsProps, FormGridProps } from './layout.types';

export function FormGrid({ children, columns = 2 }: FormGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          md: columns === 1 ? '1fr' : `repeat(${columns}, minmax(0, 1fr))`,
        },
      }}
    >
      {children}
    </Box>
  );
}

export function FormActions({ children }: FormActionsProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        borderTop: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        gap: 1,
        justifyContent: 'flex-end',
        mt: 0.5,
        pt: 2,
        '& > button': { minWidth: { sm: 148 }, width: { xs: '100%', sm: 'auto' } },
      }}
    >
      {children}
    </Box>
  );
}
