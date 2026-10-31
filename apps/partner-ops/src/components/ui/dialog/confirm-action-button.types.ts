import type { OverlayRequest } from '@packages/platform-contracts';

import type { ConfirmIntent } from './confirm-action-button';

export type IntentIconProps = { intent: ConfirmIntent };

export type ConfirmActionButtonProps = {
  onConfirm: () => Promise<unknown>;
  label?: string;
  confirmMessage?: string;
  title?: string;
  intent?: ConfirmIntent;
  isPending: boolean;
  error: Error | null;
  onReset: () => void;
  remote?: OverlayRequest;
  onCompleted?: () => void;
  surface?: boolean;
};
