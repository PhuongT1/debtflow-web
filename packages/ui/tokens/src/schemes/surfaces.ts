import { brand } from '../palette/brand';
import { neutral } from '../palette/neutral';
import { withOpacity } from '../palette/opacity';

// Opaque layers keep nested cards and popup content independent of the page beneath them.
export const surfaceColors = {
  light: {
    background: neutral[50],
    navigation: brand[50],
    surface: neutral[0],
    surfaceRaised: neutral[0],
    surfaceInset: neutral[100],
    surfaceHover: '#e9edf5',
    text: neutral[900],
    textSecondary: neutral[600],
    textDisabled: neutral[400],
    divider: neutral[200],
    disabledSurface: neutral[100],
    backdrop: withOpacity(neutral[950], 0.48),
  },
  dark: {
    background: neutral[950],
    navigation: neutral[900],
    surface: neutral[900],
    surfaceRaised: neutral[800],
    surfaceInset: '#131b2b',
    surfaceHover: '#263249',
    text: '#eef2f8',
    textSecondary: '#b2bed0',
    textDisabled: '#7f8ba0',
    divider: '#344057',
    disabledSurface: '#253047',
    backdrop: 'rgba(3, 7, 18, 0.72)',
  },
};
