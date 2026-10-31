export type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
