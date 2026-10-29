import type { ThemeMode } from '../theme.types';
import { withOpacity } from './opacity';
import { neutral } from './neutral';

// Blue-to-sky ramp; foreground-safe solid actions use 600 or darker.
export const brand = {
  50: '#eff6ff',
  100: '#dbeafe',
  200: '#bedbff',
  300: '#8ec5ff',
  400: '#51a2ff',
  500: '#2b7fff',
  600: '#155dfc',
  700: '#1447e6',
  800: '#193cb8',
  900: '#1c398e',
} as const;

export function createBrandRoles(mode: ThemeMode) {
  return {
    primary: brand[600],
    primaryDark: brand[700],
    primaryLight: mode === 'light' ? brand[50] : withOpacity(brand[400], 0.14),
    primaryContrast: neutral[0],
    primaryText: mode === 'light' ? brand[700] : brand[300],
    primarySelected: withOpacity(
      mode === 'light' ? brand[600] : brand[300],
      mode === 'light' ? 0.1 : 0.16,
    ),
  };
}
