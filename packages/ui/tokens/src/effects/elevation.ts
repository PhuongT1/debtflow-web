import type { ThemeMode } from '../theme.types';
import { brand } from '../palette/brand';
import { neutral } from '../palette/neutral';
import { withOpacity } from '../palette/opacity';

export function createElevation(mode: ThemeMode) {
  const dark = mode === 'dark';
  const ink = dark ? '#000000' : neutral[900];
  return {
    surface: `0 2px 6px ${withOpacity(ink, dark ? 0.16 : 0.03)}, 0 12px 28px -8px ${withOpacity(ink, dark ? 0.24 : 0.08)}`,
    floating: `0 0 2px ${withOpacity(ink, dark ? 0.32 : 0.12)}, 0 12px 32px -4px ${withOpacity(ink, dark ? 0.44 : 0.16)}`,
    dialog: `0 0 2px ${withOpacity(ink, dark ? 0.4 : 0.16)}, 0 24px 64px -12px ${withOpacity(ink, dark ? 0.64 : 0.28)}`,
    primary: `0 8px 20px -8px ${withOpacity(brand[600], dark ? 0.48 : 0.4)}`,
    fixedLeft: `3px 0 8px ${withOpacity(ink, dark ? 0.28 : 0.06)}`,
    fixedRight: `-3px 0 8px ${withOpacity(ink, dark ? 0.28 : 0.06)}`,
  };
}
