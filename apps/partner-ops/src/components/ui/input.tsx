import { TextField, type TextFieldProps } from '@mui/material';

export function AppInput(props: TextFieldProps) {
  return <TextField fullWidth size="small" variant="outlined" {...props} />;
}
