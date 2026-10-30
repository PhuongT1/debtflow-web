import { Button as MuiButton } from '@mui/material';

import type { AppButtonProps } from './button.types';

export function AppButton({
  disabled,
  loading = false,
  size = 'medium',
  tone,
  variant = 'primary',
  ...rest
}: AppButtonProps) {
  return (
    <MuiButton
      color={tone ?? (variant === 'danger' ? 'error' : 'primary')}
      disabled={disabled || loading}
      loading={loading}
      size={size}
      variant={variant === 'secondary' ? 'outlined' : 'contained'}
      {...rest}
    />
  );
}
