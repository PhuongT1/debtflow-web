// Event Bus
export { DEBTFLOW_EVENT_VERSION, type DebtflowEventMap } from './event-bus/event-map.types';
export { publishPlatformEvent, subscribePlatformEvent } from './event-bus/event-bus';

// Storage & Locale synchronization
export { getStoredLocale, setStoredLocale } from './storage/locale-storage';

// Central authentication navigation
export { buildLoginUrl } from './navigation/login-url';
export { signOutFromPlatform } from './auth/sign-out';
export { openPlatformOverlay, type OpenPlatformOverlayOptions } from './overlays/client';
export { emitOverlayMessage, listenOverlayMessages, type OverlayPeer } from './overlays/channel';
export { connectOverlaySurface } from './overlays/surface';
export { createOverlayHostBridge, type OverlaySession, type OverlayRuntime } from './overlays/host';
export { createWindowMessenger, type WindowPeer } from './messaging/window-messenger';
export { createPlatformClient } from './messaging/platform-client';
export { createRemoteClient } from './messaging/remote-client';
export type {
  PlatformClientOptions,
  RemoteClientOptions,
  PlatformClientListeners,
  RemoteClientListeners,
  PlatformRouteOptions,
  PlatformLocaleOptions,
  PlatformReadyOptions,
  WindowMessengerOptions,
  PostWindowMessageOptions,
  ListenWindowMessagesOptions,
  MessageValidator,
} from './messaging/messaging.types';
export type {
  OpenOverlayOptions,
  EmitOverlayMessageOptions,
  ListenOverlayMessagesOptions,
  OverlayHostBridgeOptions,
  OverlayHeightOptions,
  OverlaySurfaceTarget,
  OverlayCompletionOptions,
  OverlaySurfaceOptions,
  OverlaySurfaceInitOptions,
  OverlaySurfaceMeasurement,
  OverlaySurfaceCompletion,
} from './overlays/overlay.types';
