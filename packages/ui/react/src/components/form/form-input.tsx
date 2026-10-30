'use client';

import { Controller, type FieldValues } from 'react-hook-form';

import type { FormInputProps } from './form-input.types';
import { Input } from './input';

/** Bind one MUI field to RHF, including validation and the actual input focus ref. */
export function FormInput<T extends FieldValues, TContext = unknown, TOutput = T>({
  control,
  name,
  helperText,
  error,
  ...rest
}: FormInputProps<T, TContext, TOutput>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, value, ...field }, fieldState }) => (
        <Input
          {...rest}
          {...field}
          inputRef={ref}
          value={value ?? ''}
          error={error ?? Boolean(fieldState.error)}
          helperText={helperText ?? fieldState.error?.message}
        />
      )}
    />
  );
}
