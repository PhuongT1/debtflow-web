import type { createBrandEffects } from './effects/brand';
import type { createElevation } from './effects/elevation';
import type { createBrandRoles } from './palette/brand';
import type { statusColors } from './palette/status';
import type { surfaceColors } from './schemes/surfaces';

export type ThemeMode = 'light' | 'dark';
export interface ThemeScheme {
  color: Record<
    keyof (ReturnType<typeof createBrandRoles> &
      typeof statusColors.light &
      typeof surfaceColors.light),
    string
  >;
  shadow: ReturnType<typeof createElevation>;
  effect: ReturnType<typeof createBrandEffects>;
}
