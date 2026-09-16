import { Box, Tooltip } from '@mui/material';

export function ClampedText({
  children,
  lines = 2,
  title,
}: {
  children: React.ReactNode;
  lines?: number;
  title: string;
}) {
  return (
    <Tooltip enterDelay={500} title={title}>
      <Box
        component="span"
        sx={{
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: lines,
          display: '-webkit-box',
          overflow: 'hidden',
          overflowWrap: 'anywhere',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
