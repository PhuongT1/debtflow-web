import { Box } from '@mui/material';

import type { FormActionsProps, FormGridProps } from './layout.types';

export function FormGrid({ children, columns = 2 }: FormGridProps) {
  return (
    <Box sx={{ containerType: 'inline-size', width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: '1fr',
          '@container (min-width: 600px)': {
            gridTemplateColumns: columns === 1 ? '1fr' : `repeat(${columns}, minmax(0, 1fr))`,
          },
        }}
      >
        {children}
      </Box>
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
