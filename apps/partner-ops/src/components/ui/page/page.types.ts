import type { PageContentWidth } from './page';

export type PageProps = {
  children: React.ReactNode;
  fillAvailable?: boolean;
  contentWidth?: PageContentWidth;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  parent?: string;
  parentHref?: string;
  badge?: React.ReactNode;
  compact?: boolean;
};

export type PageGridProps = {
  children: React.ReactNode;
  columns?: 2 | 3;
};

export type MetricGridProps = {
  children: React.ReactNode;
  columns?: 4 | 5;
};

export type PageSplitProps = {
  aside: React.ReactNode;
  children: React.ReactNode;
  asideWidth?: number;
};
