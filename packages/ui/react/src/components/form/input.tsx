import { TextField } from '@mui/material';
import type { AppInputProps } from './form.types';

export function AppInput(props: AppInputProps) {
  return <TextField {...props} />;
}
