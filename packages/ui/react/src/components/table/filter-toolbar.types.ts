import type { Breakpoint } from '@mui/material';
import type { FormEventHandler, ReactNode } from 'react';

export interface FilterToolbarProps {
  children: ReactNode;
  columns?: Partial<Record<Breakpoint, string>>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  showLabel: string;
  hideLabel: string;
}
