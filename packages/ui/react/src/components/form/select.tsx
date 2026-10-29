import { TextField } from '@mui/material';
import type { AppSelectProps } from './form.types';

export function AppSelect(props: AppSelectProps) {
  return <TextField select {...props} />;
}
