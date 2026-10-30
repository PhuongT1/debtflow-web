import type { Components, Theme } from '@mui/material';

import { designTokens } from '@packages/ui-tokens';

export const buttonComponents: Components<Theme> = {
  MuiButton: {
    defaultProps: { size: 'medium' },
    styleOverrides: {
      root: {
        borderRadius: designTokens.radius.md,
        boxShadow: 'none',
        paddingLeft: 18,
        paddingRight: 18,
        transition: 'background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
        '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: {
              color: designTokens.color.primaryContrast,
              backgroundColor: designTokens.color.primary,
              backgroundImage: designTokens.effect.primaryGradient,
              boxShadow: designTokens.shadow.primary,
              '&:hover': {
                backgroundColor: designTokens.color.primaryDark,
                backgroundImage: designTokens.effect.primaryHoverGradient,
                boxShadow: designTokens.shadow.primary,
              },
              '&.Mui-disabled': {
                color: designTokens.color.textDisabled,
                backgroundColor: designTokens.color.disabledSurface,
                backgroundImage: 'none',
                boxShadow: 'none',
              },
            },
          },
          {
            props: { variant: 'text', color: 'primary' },
            style: { color: designTokens.color.primaryText },
          },
          {
            props: { variant: 'outlined', color: 'primary' },
            style: { color: designTokens.color.primaryText },
          },
        ],
      },
      outlined: ({ theme }) => ({
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        borderColor: (theme.vars ?? theme).palette.divider,
        '&:hover': {
          backgroundColor: (theme.vars ?? theme).palette.action.hover,
          borderColor: designTokens.color.primaryText,
        },
      }),
      sizeSmall: { paddingLeft: 12, paddingRight: 12 },
    },
  },
};
