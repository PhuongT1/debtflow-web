export type ActionMetricProps = { children: React.ReactNode; href: string };

export type DashboardPageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};
