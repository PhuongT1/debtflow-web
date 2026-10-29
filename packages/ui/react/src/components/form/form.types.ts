import type { ReactNode } from 'react';
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import type { TextFieldProps } from '@mui/material';

export type AppInputProps = TextFieldProps;
export type AppSelectProps = TextFieldProps;

export interface AppDatePickerProps extends Omit<
  DatePickerProps,
  'label' | 'value' | 'defaultValue' | 'onChange' | 'format'
> {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
}
