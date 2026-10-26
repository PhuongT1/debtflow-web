import { Box, Typography } from '@mui/material';

export function DetailList({
  items,
  columns = 1,
}: {
  items: Array<{ label: string; value: React.ReactNode }>;
  columns?: 1 | 2;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 0,
        gridTemplateColumns: { xs: '1fr', sm: columns === 2 ? 'repeat(2, minmax(0, 1fr))' : '1fr' },
      }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          sx={{
            borderBottom: '1px dashed',
            borderColor: 'divider',
            display: 'grid',
            gap: 0.5,
            py: 1.4,
            '&:first-of-type': { pt: 0 },
            '&:last-child': { borderBottom: 0, pb: 0 },
          }}
        >
          <Typography color="text.secondary" sx={{ fontSize: 11.5, fontWeight: 650 }}>
            {item.label}
          </Typography>
          <Typography sx={{ fontSize: 13.5, fontWeight: 650, overflowWrap: 'anywhere' }}>
            {item.value || '-'}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
