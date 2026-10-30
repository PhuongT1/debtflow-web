import type {
  AppLocale,
  OverlayMessage,
  OverlayRequest,
  OverlayResult,
} from '@packages/platform-contracts';

import type { WindowPeer } from '../messaging/messaging.types';

export type OverlayPeer = WindowPeer;
export interface OpenOverlayOptions {
  request: OverlayRequest;
  signal?: AbortSignal;
}
export interface OpenPlatformOverlayOptions extends OpenOverlayOptions {
  hostOrigin: string;
}
export interface EmitOverlayMessageOptions {
  peer: OverlayPeer;
  message: OverlayMessage;
}
export interface ListenOverlayMessagesOptions {
  peer: OverlayPeer;
  handler: (message: OverlayMessage) => void;
  id?: string;
}
export interface OverlayRuntime {
  id: string;
  url: string;
}
export interface OverlaySession extends OverlayRuntime {
  request: OverlayRequest;
}
export interface OverlayHeightOptions {
  height: number;
}
export interface OverlaySurfaceTarget {
  target: Window;
}
export interface OverlayCompletionOptions {
  result: OverlayResult;
}
export interface OverlayHostBridgeOptions {
  owner: WindowPeer;
  views: Record<string, string>;
  baseUrl: string;
  getSurfaceWindow: () => Window | null;
  getLocale: () => AppLocale;
  onRuntime?: (runtime: OverlayRuntime) => void;
  onOpen: (session: OverlaySession) => void;
  onPresent: (options: OverlayHeightOptions) => void;
  onResize: (options: OverlayHeightOptions) => void;
  onFinish: (result: OverlayResult) => void;
}
export interface OverlaySurfaceInitOptions {
  id: string;
  request: OverlayRequest;
  locale?: AppLocale;
}
export interface OverlaySurfaceOptions {
  hostOrigin: string;
  id: string;
  onInit: (options: OverlaySurfaceInitOptions) => void;
  onCloseRequest: () => void;
  onActivate?: () => void;
}
export interface OverlaySurfaceMeasurement extends OverlayHeightOptions {
  id: string;
}
export interface OverlaySurfaceCompletion extends OverlayCompletionOptions {
  id: string;
}
