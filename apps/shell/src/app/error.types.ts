export type RootErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
