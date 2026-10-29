import type { AppLocale } from '@packages/platform-contracts';

export interface WindowPeer {
  target: Window;
  origin: string;
}
export type MessageValidator<Message> = (value: unknown) => value is Message;
export type WindowMessageSubscriber = (event: MessageEvent) => void;
export interface WindowMessageDispatcher {
  subscribe: (subscriber: WindowMessageSubscriber) => () => void;
}
export interface WindowMessengerOptions<Message> {
  getPeer: () => WindowPeer | null;
  validate: MessageValidator<Message>;
}
export interface PostWindowMessageOptions<Message> {
  message: Message;
}
export interface ListenWindowMessagesOptions<Message> {
  handler: (message: Message) => void;
  matches?: (message: Message) => boolean;
}
export interface PlatformClientOptions {
  source: string;
  getHostOrigin: () => string;
}
export interface RemoteClientOptions {
  source: string;
  getPeer: () => WindowPeer | null;
}
export interface PlatformRouteOptions {
  path: string;
}
export interface PlatformLocaleOptions {
  locale: AppLocale;
}
export interface PlatformReadyOptions {
  capabilities: string[];
}
export interface PlatformClientListeners {
  onLocale: (options: PlatformLocaleOptions) => void;
  onRoute: (options: PlatformRouteOptions) => void;
}
export interface RemoteClientListeners {
  onReady: (options: PlatformReadyOptions) => void;
  onNavigate: (options: PlatformRouteOptions) => void;
}
