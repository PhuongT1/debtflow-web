import type { ConfirmIntent } from './confirm-action-button';

export type IntentIconProps = { intent: ConfirmIntent };

export type ConfirmActionButtonProps = {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
  title?: string;
  intent?: ConfirmIntent;
  invalidateQueryKey?: readonly unknown[];
  refreshRoute?: boolean;
};
