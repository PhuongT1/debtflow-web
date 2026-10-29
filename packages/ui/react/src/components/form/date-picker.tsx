'use client';

import dayjs, { type Dayjs } from 'dayjs';
import type { AppDatePickerProps } from './form.types';
import { mergeSlotProps } from '@mui/material/utils';
import {
  PickerCalendarIcon,
  PickerPreviousIcon,
  PickerNextIcon,
  ControlChevronIcon,
} from './control-icons';
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
  slots,
  slotProps,
  ...rest
}: AppDatePickerProps) {
  return (
    <DatePicker
      {...rest}
      slots={{
        openPickerIcon: PickerCalendarIcon,
        leftArrowIcon: PickerPreviousIcon,
        rightArrowIcon: PickerNextIcon,
        switchViewIcon: ControlChevronIcon,
        ...slots,
      }}
      format="DD/MM/YYYY"
      label={label}
      onChange={(nextValue) => onChange(toDateInput(nextValue))}
      slotProps={{
        ...slotProps,
        textField: mergeSlotProps(slotProps?.textField, {
          error,
          fullWidth: true,
          helperText,
          size: 'small',
          required,
        }),
        openPickerButton: mergeSlotProps(slotProps?.openPickerButton, {
          size: 'small',
          sx: {
            color: error ? 'error.main' : 'var(--df-color-primary-text)',
            '&.Mui-disabled': { color: 'text.disabled' },
            '& svg': { fontSize: 20 },
          },
        }),
      }}
      value={fromDateInput(value)}
    />
  );
}
