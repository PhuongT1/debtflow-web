export type PageProps = {
  children: React.ReactNode;
  fillAvailable?: boolean;
};

export type PageHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
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
