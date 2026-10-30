import type { TextFieldProps } from '@mui/material';
import type { DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { ReactNode } from 'react';

export type InputProps = TextFieldProps;
export type SelectFieldProps = TextFieldProps;

export interface DatePickerProps extends Omit<
  MuiDatePickerProps,
  'label' | 'value' | 'defaultValue' | 'onChange' | 'format'
> {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
}

/** @deprecated Use InputProps. */
export type AppInputProps = InputProps;
/** @deprecated Use SelectFieldProps. */
export type AppSelectProps = SelectFieldProps;
/** @deprecated Use DatePickerProps. */
export type AppDatePickerProps = DatePickerProps;
