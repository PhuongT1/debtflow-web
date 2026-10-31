export interface ApplicationErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  fullPage?: boolean;
}
