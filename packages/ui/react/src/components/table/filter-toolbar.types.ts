import type { FormEventHandler, ReactNode } from 'react';
import type { Breakpoint } from '@mui/material';

export interface FilterToolbarProps {
  children: ReactNode;
  columns?: Partial<Record<Breakpoint, string>>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  showLabel: string;
  hideLabel: string;
}
