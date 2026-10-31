import type { OverlayRequest } from '@packages/platform-contracts';

import type { AppIconName } from '@/components/ui/app-icon';

export type SetGuardGuardOptions = { dirty: boolean; pending: boolean };

export type FormDialogProps = {
  buttonLabel: string;
  buttonIcon?: AppIconName;
  buttonSize?: 'small' | 'medium';
  buttonVariant?: 'primary' | 'secondary' | 'danger';
  iconOnly?: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  remote?: OverlayRequest;
  onCompleted?: () => void;
  surface?: boolean;
};
