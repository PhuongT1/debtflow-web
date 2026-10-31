import { Box, Tooltip } from '@mui/material';

import type { ClampedTextProps } from './clamped-text.types';

export function ClampedText({ children, lines = 2, title }: ClampedTextProps) {
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
