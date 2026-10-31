import type { ReactNode } from 'react';

export type DataTableStateProps = {
  columns: number;
  fillHeight?: boolean;
  message: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
};
