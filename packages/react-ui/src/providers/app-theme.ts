import { alpha, createTheme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import 'dayjs/locale/vi';
import { designTokens } from '@debtflow/design-tokens';

// Intentionally over 230 lines: MUI theme tokens and overrides must remain
// in one module so the visual system can be reviewed and evolved coherently.

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    background: {
      default: designTokens.color.background,
      paper: designTokens.color.surface,
    },
    primary: {
      main: designTokens.color.primary,
      dark: designTokens.color.primaryDark,
      light: designTokens.color.primaryLight,
    },
    secondary: {
      main: designTokens.color.secondary,
    },
    info: {
      main: '#0891b2',
      light: '#67e8f9',
    },
    success: {
      main: designTokens.color.success,
    },
    warning: {
      main: designTokens.color.warning,
    },
    error: {
      main: designTokens.color.error,
    },
    text: {
      primary: designTokens.color.text,
      secondary: designTokens.color.textSecondary,
      disabled: designTokens.color.textDisabled,
    },
    divider: designTokens.color.divider,
    action: {
      hover: '#f4f7fb',
      selected: '#eaf1ff',
    },
  },
  shape: {
    borderRadius: designTokens.radius.md,
  },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.25 },
    h3: { fontSize: '1.25rem', fontWeight: 750, lineHeight: 1.3 },
    h6: { fontWeight: 750 },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.5 },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'medium',
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 10,
          boxShadow: 'none',
          paddingLeft: 18,
          paddingRight: 18,
          transition:
            'background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-1px)',
          },
          '&.MuiButton-containedPrimary': {
            boxShadow: theme.shadows[3],
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              boxShadow: theme.shadows[6],
            },
          },
          '&.Mui-disabled': { transform: 'none' },
        }),
        outlined: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderColor: theme.palette.divider,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
            borderColor: theme.palette.primary.light,
          },
        }),
        sizeSmall: {
          paddingLeft: 12,
          paddingRight: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: 'small',
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: 10,
          transition: 'box-shadow 160ms ease, border-color 160ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled,
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
        }),
        input: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontSize: 14.5,
        }),
      },
    },
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          borderRadius: 10,
          transition: 'box-shadow 160ms ease, border-color 160ms ease',
          '& .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '&:hover .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled,
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
          '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px',
          },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.secondary,
          fontSize: 14,
          '&.Mui-focused': { color: theme.palette.primary.main },
        }),
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: ({ theme }) => ({
          color: theme.palette.text.secondary,
          right: 12,
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          backgroundColor: theme.palette.action.hover,
          color: theme.palette.text.secondary,
          fontSize: 12,
          fontWeight: 750,
          paddingBottom: 10,
          paddingTop: 10,
          textTransform: 'uppercase',
        }),
        root: ({ theme }) => ({
          borderBottomColor: theme.palette.divider,
          paddingBottom: 8,
          paddingTop: 8,
        }),
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
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 12,
          boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.1)}`,
          overflow: 'hidden',
        }),
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontWeight: 700,
        }),
        switchViewButton: ({ theme }) => ({
          color: theme.palette.text.secondary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: ({ theme }) => ({
          color: theme.palette.text.secondary,
          fontWeight: 600,
        }),
      },
    },
    MuiPickerDay: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          fontWeight: 500,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.MuiPickerDay-today:not(.Mui-selected)': {
            backgroundColor: alpha(theme.palette.primary.main, 0.06),
            outline: `1px solid ${alpha(theme.palette.primary.main, 0.24)}`,
          },
          '&.Mui-selected': {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            outline: 'none',
            '&:focus, &:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
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
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 14,
          boxShadow: theme.shadows[16],
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
          color: theme.palette.text.secondary,
          transition: 'background-color 160ms ease, color 160ms ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.09),
            color: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 10,
          boxShadow: theme.shadows[10],
          marginTop: 6,
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 7,
          fontSize: 14,
          margin: '2px 6px',
          minHeight: 40,
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.primary.dark,
          },
          '&.Mui-selected:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.focusOpacity),
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
          backgroundColor: alpha(theme.palette.text.primary, 0.055),
          borderRadius: 6,
          '&::after': {
            background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.background.paper, 0.32)}, transparent)`,
          },
        }),
      },
    },
  },
});
