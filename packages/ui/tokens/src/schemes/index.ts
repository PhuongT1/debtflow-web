import { createBrandEffects } from '../effects/brand';
import { createElevation } from '../effects/elevation';
import { createBrandRoles } from '../palette/brand';
import { statusColors } from '../palette/status';
import type { ThemeMode, ThemeScheme } from '../theme.types';

import { surfaceColors } from './surfaces';

function createScheme(mode: ThemeMode): ThemeScheme {
  return {
    color: { ...surfaceColors[mode], ...statusColors[mode], ...createBrandRoles(mode) },
    shadow: createElevation(mode),
    effect: createBrandEffects(),
  };
}

export const themeSchemes = { light: createScheme('light'), dark: createScheme('dark') };
export type { ThemeMode } from '../theme.types';
