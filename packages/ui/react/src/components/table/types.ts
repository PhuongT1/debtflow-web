import type { Theme } from '@mui/material';
import type { ReactNode } from 'react';
export type FixedTableSide = 'left' | 'right';

export type TableScroll = {
  x?: number | string;
  y?: number | string;
};

export type TableSortDirection = 'asc' | 'desc';
export interface SortableTableHeaderProps {
  active: boolean;
  direction?: TableSortDirection;
  href?: string;
  label: ReactNode;
  onClick?: () => void;
}

export interface FixedCellStyleOptions {
  theme: Theme;
  fixed?: FixedTableSide;
  fixedOffset?: number | string;
  showShadow?: boolean;
}
