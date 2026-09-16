'use client';

import dayjs, { type Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export function toDateInput(value: Dayjs | null) {
  return value?.isValid() ? value.format('YYYY-MM-DD') : '';
}

export function fromDateInput(value?: string | null) {
  return value ? dayjs(value) : null;
}

export function AppDatePicker({
  label,
  value,
  onChange,
  error,
  helperText,
  required,
}: {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
}) {
  return (
    <DatePicker
      format="DD/MM/YYYY"
      label={`${label}${required ? ' *' : ''}`}
      onChange={(nextValue) => onChange(toDateInput(nextValue))}
      slotProps={{
        textField: {
          error,
          fullWidth: true,
          helperText,
          size: 'small',
        },
      }}
      value={fromDateInput(value)}
    />
  );
}
