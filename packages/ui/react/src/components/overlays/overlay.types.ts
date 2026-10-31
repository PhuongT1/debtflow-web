import type { DialogProps } from '@mui/material';
import type { ReactNode, RefObject } from 'react';

import type { OverlayRequest, OverlayResult } from '@packages/platform-contracts';
import type { OpenOverlayOptions } from '@packages/platform-sdk';

export type PlatformDialogProps = DialogProps & {
  surfaceBody?: boolean;
  remote?: OverlayRequest;
  hostOrigin?: string;
  openRemote?: (options: OpenOverlayOptions) => Promise<OverlayResult>;
  onFailure?: () => void;
  onCompleted?: (result: OverlayResult) => void;
  errorLabel?: string;
};
interface OverlayHostLabels {
  views: Record<string, string>;
  closeLabel: string;
  loadingLabel: string;
}
export type OverlayHostProps = OverlayHostLabels &
  (
    | { owner: RefObject<HTMLIFrameElement | null>; ownerWindow?: never }
    | { ownerWindow: Window; owner?: never }
  );
export interface OverlaySurfaceProps {
  hostOrigin: string;
  children: ReactNode;
  deferPresentation?: boolean;
}
export interface OverlaySurfaceContextValue {
  request: OverlayRequest;
  finish: (result: OverlayResult) => void;
  closeVersion: number;
  active: boolean;
  closing: boolean;
  markReady: () => void;
}
