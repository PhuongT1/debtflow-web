import { TextField } from '@mui/material';

import type { SelectFieldProps } from './form.types';

export function SelectField(props: SelectFieldProps) {
  return <TextField select {...props} />;
}

/** @deprecated Use SelectField for unbound controls. */
export const AppSelect = SelectField;
