import { TextField } from '@mui/material';

import type { InputProps } from './form.types';

export function Input(props: InputProps) {
  return <TextField {...props} />;
}

/** @deprecated Use Input for unbound controls. */
export const AppInput = Input;
