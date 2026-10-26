import { TextField, type TextFieldProps } from '@mui/material';

export function AppSelect(props: TextFieldProps) {
  return <TextField fullWidth select size="small" variant="outlined" {...props} />;
}
