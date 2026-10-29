import { Box } from '@mui/material';
import { designTokens } from '@packages/ui-tokens';
import { AppIcon } from './app-icon';
import type { AppIconBadgeProps } from './icon.types';

export function AppIconBadge({ name, tone = 'primary' }: AppIconBadgeProps) {
  const color = tone === 'primary' ? designTokens.color.primaryText : designTokens.color[tone];
  return (
    <Box
      sx={{
        display: 'grid',
        placeItems: 'center',
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: `${designTokens.radius.md}px`,
        color,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      }}
    >
      <AppIcon name={name} sx={{ fontSize: 20 }} />
    </Box>
  );
}
