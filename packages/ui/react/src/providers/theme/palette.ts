import { themeSchemes, type ThemeMode } from '@packages/ui-tokens';
import type { PaletteOptions } from '@mui/material/styles';

function createPalette(mode: ThemeMode): PaletteOptions {
  const { color } = themeSchemes[mode];
  return {
    mode,
    background: { default: color.background, paper: color.surface },
    primary: {
      main: color.primary,
      dark: color.primaryDark,
      light: color.primaryLight,
      contrastText: color.primaryContrast,
    },
    secondary: { main: color.secondary },
    info: { main: color.info, light: color.infoLight },
    success: { main: color.success },
    warning: { main: color.warning },
    error: { main: color.error },
    text: { primary: color.text, secondary: color.textSecondary, disabled: color.textDisabled },
    divider: color.divider,
    action: {
      hover: color.surfaceHover,
      selected: color.primarySelected,
      disabled: color.textDisabled,
      disabledBackground: color.disabledSurface,
    },
  };
}

export const colorSchemes = {
  light: { palette: createPalette('light') },
  dark: { palette: createPalette('dark') },
};
