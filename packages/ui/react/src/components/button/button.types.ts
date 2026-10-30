import type { ButtonProps } from '@mui/material';

export type AppButtonProps = Omit<
  ButtonProps,
  'variant' | 'color' | 'loading' | 'loadingIndicator'
> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  tone?: 'primary' | 'error' | 'warning';
};
