import { designTokens } from '@packages/ui-tokens';
import type { ThemeOptions } from '@mui/material';

export const typography = {
  fontFamily: designTokens.typography.fontFamily,
  h1: {
    fontSize: '2rem',
    fontWeight: designTokens.typography.pageTitle.fontWeight,
    lineHeight: 1.2,
  },
  h2: { fontSize: '1.5rem', fontWeight: 650, lineHeight: 1.25 },
  h3: { fontSize: '1.25rem', fontWeight: 650, lineHeight: 1.3 },
  h6: { fontWeight: 650 },
  body1: { ...designTokens.typography.body },
  body2: { lineHeight: 1.5 },
  button: {
    fontWeight: designTokens.typography.control.fontWeight,
    textTransform: 'none',
  },
} satisfies ThemeOptions['typography'];
