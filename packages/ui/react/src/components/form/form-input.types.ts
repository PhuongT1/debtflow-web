import type { TextFieldProps } from '@mui/material';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

export type FormInputProps<T extends FieldValues, TContext = unknown, TOutput = T> = Omit<
  TextFieldProps,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'inputRef'
> & {
  name: FieldPath<T>;
  control: Control<T, TContext, TOutput>;
};
