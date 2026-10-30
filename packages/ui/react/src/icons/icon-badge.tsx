'use client';

import { Box, useTheme } from '@mui/material';

import { AppIcon } from './app-icon';
import type { AppIconBadgeProps } from './icon.types';

export function AppIconBadge({ name, tone = 'primary' }: AppIconBadgeProps) {
  const theme = useTheme();
  const palette = (theme.vars ?? theme).palette;
  const color = tone === 'primary' ? palette.text.brand : palette[tone].main;
  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: 1,
        color,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      }}
    >
      <AppIcon name={name} sx={{ fontSize: 20 }} />
    </Box>
  );
}
