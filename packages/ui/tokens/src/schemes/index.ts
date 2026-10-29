import { createBrandRoles } from '../palette/brand';
import { statusColors } from '../palette/status';
import { surfaceColors } from './surfaces';
import { createElevation } from '../effects/elevation';
import { createBrandEffects } from '../effects/brand';
import type { ThemeMode, ThemeScheme } from '../theme.types';

function createScheme(mode: ThemeMode): ThemeScheme {
  return {
    color: { ...surfaceColors[mode], ...statusColors[mode], ...createBrandRoles(mode) },
    shadow: createElevation(mode),
    effect: createBrandEffects(),
  };
}

export const themeSchemes = { light: createScheme('light'), dark: createScheme('dark') };
export type { ThemeMode } from '../theme.types';
