import { createTheme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import 'dayjs/locale/vi';
import { designTokens } from '@packages/ui-tokens';
import { colorSchemes } from './theme/palette';
import { typography } from './theme/typography';
import { formControls } from './theme/components/form-controls';
import { buttonComponents } from './theme/components/buttons';

// Compose the shared theme from tokens and responsibility-specific overrides.

export const appTheme = createTheme({
  breakpoints: { values: designTokens.layout.breakpoints },
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes,
  shape: {
    borderRadius: designTokens.radius.md,
  },
  typography,
  components: {
    ...buttonComponents,
    ...formControls,
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          backgroundColor: designTokens.color.surfaceInset,
          color: (theme.vars ?? theme).palette.text.secondary,
          ...designTokens.typography.tableHead,
          paddingBottom: 10,
          paddingTop: 10,
          textTransform: 'uppercase',
        }),
        root: ({ theme }) => ({
          borderBottomColor: (theme.vars ?? theme).palette.divider,
          paddingBottom: 8,
          paddingTop: 8,
        }),
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          variants: [
            {
              props: { invisible: false },
              style: { backgroundColor: designTokens.color.backdrop },
            },
          ],
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          backgroundColor: designTokens.color.surfaceRaised,
          boxShadow: designTokens.shadow.floating,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiPickerPopper: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: designTokens.color.surfaceRaised,
          border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
          borderRadius: designTokens.radius.lg,
          boxShadow: designTokens.shadow.floating,
          overflow: 'hidden',
        }),
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: ({ theme }) => ({
          color: (theme.vars ?? theme).palette.text.primary,
          fontWeight: 700,
        }),
        switchViewButton: ({ theme }) => ({
          color: (theme.vars ?? theme).palette.text.secondary,
          '&:hover': {
            backgroundColor: (theme.vars ?? theme).palette.action.hover,
          },
        }),
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: ({ theme }) => ({
          color: (theme.vars ?? theme).palette.text.secondary,
          fontWeight: 600,
        }),
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: (theme.vars ?? theme).palette.text.primary,
          fontWeight: 500,
          '&:hover': {
            backgroundColor: (theme.vars ?? theme).palette.action.hover,
          },
          '&.MuiPickerDay-today:not(.Mui-selected)': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 6%, transparent)`,
            outline: `1px solid color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 24%, transparent)`,
          },
          '&.Mui-selected': {
            backgroundColor: (theme.vars ?? theme).palette.primary.main,
            color: (theme.vars ?? theme).palette.primary.contrastText,
            outline: 'none',
            '&:focus, &:hover': {
              backgroundColor: (theme.vars ?? theme).palette.primary.dark,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
          borderRadius: designTokens.radius.lg,
          boxShadow: designTokens.shadow.surface,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backdropFilter: 'blur(3px)',
          },
        },
        paper: ({ theme }) => ({
          backgroundColor: designTokens.color.surfaceRaised,
          border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
          borderRadius: designTokens.radius.lg,
          boxShadow: designTokens.shadow.dialog,
        }),
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { padding: '22px 24px 18px' } },
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: 24 } },
    },
    MuiIconButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '50%',
          color: (theme.vars ?? theme).palette.text.secondary,
          transition: 'background-color 160ms ease, color 160ms ease',
          '&:hover': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 9%, transparent)`,
            color: designTokens.color.primaryText,
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: designTokens.color.surfaceRaised,
          border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
          borderRadius: Number(theme.shape.borderRadius),
          boxShadow: designTokens.shadow.floating,
          marginTop: 6,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: designTokens.radius.sm,
          fontSize: 14,
          margin: '2px 6px',
          minHeight: 40,
          '&.Mui-selected': {
            backgroundColor: (theme.vars ?? theme).palette.action.selected,
            color: designTokens.color.primaryText,
          },
          '&.Mui-selected:hover': {
            backgroundColor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 16%, transparent)`,
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 700 } },
    },
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.text.primary} 5.5%, transparent)`,
          borderRadius: designTokens.radius.sm,
          '&::after': {
            background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${(theme.vars ?? theme).palette.background.paper} 32%, transparent), transparent)`,
          },
        }),
      },
    },
  },
});
