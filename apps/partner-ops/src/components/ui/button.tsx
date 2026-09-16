import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

type ButtonProps = Omit<MuiButtonProps, 'variant' | 'color' | 'loading' | 'loadingIndicator'> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  tone?: 'primary' | 'error' | 'warning';
};

export function Button({
  disabled,
  loading = false,
  size = 'medium',
  tone,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const color = tone ?? (variant === 'danger' ? 'error' : 'primary');

  return (
    <MuiButton
      color={color}
      disabled={disabled || loading}
      loading={loading}
      size={size}
      variant={variant === 'secondary' ? 'outlined' : 'contained'}
      sx={{ fontWeight: 700, textTransform: 'none' }}
      {...props}
    />
  );
}
