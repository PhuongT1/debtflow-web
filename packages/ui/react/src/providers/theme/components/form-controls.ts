import { type Components, type Theme } from '@mui/material';
import type {} from '@mui/x-date-pickers/themeAugmentation';

import { designTokens } from '@packages/ui-tokens';

import { ControlChevronIcon } from '../../../components/form/control-icons';

export const formControls: Components<Theme> = {
  MuiTextField: {
    defaultProps: {
      fullWidth: true,
      size: 'small',
      variant: 'outlined',
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
        variants: [
          {
            props: { size: 'small', multiline: false },
            style: { minHeight: designTokens.control.fieldHeight },
          },
        ],
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        borderRadius: Number(theme.shape.borderRadius),
        transition: 'box-shadow 160ms ease, border-color 160ms ease',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.divider,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.text.disabled,
        },
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 10%, transparent)`,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: designTokens.color.primaryText,
          borderWidth: '1px',
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.error.main,
        },
        '&.Mui-error.Mui-focused': {
          boxShadow: `0 0 0 3px color-mix(in srgb, ${(theme.vars ?? theme).palette.error.main} 10%, transparent)`,
        },
      }),
      input: ({ theme }) => ({
        color: (theme.vars ?? theme).palette.text.primary,
        fontSize: designTokens.typography.field.fontSize,
      }),
    },
  },
  MuiPickersOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        fontSize: designTokens.typography.field.fontSize,
        minHeight: designTokens.control.fieldHeight,
        backgroundColor: (theme.vars ?? theme).palette.background.paper,
        borderRadius: Number(theme.shape.borderRadius),
        transition: 'box-shadow 160ms ease, border-color 160ms ease',
        '& .MuiPickersOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.divider,
        },
        '&:hover .MuiPickersOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.text.disabled,
        },
        '&.Mui-focused': {
          boxShadow: `0 0 0 3px color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.main} 10%, transparent)`,
        },
        '&.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
          borderColor: designTokens.color.primaryText,
          borderWidth: '1px',
        },
        '&.Mui-error .MuiPickersOutlinedInput-notchedOutline': {
          borderColor: (theme.vars ?? theme).palette.error.main,
        },
        '&.Mui-error.Mui-focused': {
          boxShadow: `0 0 0 3px color-mix(in srgb, ${(theme.vars ?? theme).palette.error.main} 10%, transparent)`,
        },
      }),
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: (theme.vars ?? theme).palette.text.secondary,
        fontSize: designTokens.typography.field.labelFontSize,
        '&.Mui-focused': { color: designTokens.color.primaryText },
      }),
    },
  },
  MuiSelect: {
    defaultProps: { IconComponent: ControlChevronIcon },
    styleOverrides: {
      icon: ({ theme }) => ({
        color: (theme.vars ?? theme).palette.text.secondary,
        right: 12,
      }),
    },
  },
};
