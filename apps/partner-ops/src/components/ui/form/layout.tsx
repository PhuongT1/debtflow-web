import { Box } from '@mui/material';

export function FormGrid({
  children,
  columns = 2,
}: {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}) {
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

export function FormActions({ children }: { children: React.ReactNode }) {
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
