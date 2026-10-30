import { isOverlayMessage } from '@packages/platform-contracts';

import { createWindowMessenger } from '../messaging/window-messenger';

import type {
  EmitOverlayMessageOptions,
  ListenOverlayMessagesOptions,
  OverlayPeer,
} from './overlay.types';
export type { OverlayPeer } from './overlay.types';
const channel = (peer: OverlayPeer) =>
  createWindowMessenger({ getPeer: () => peer, validate: isOverlayMessage });

/** All protocol adapters delegate to the one global window dispatcher. */
export function emitOverlayMessage({ peer, message }: EmitOverlayMessageOptions) {
  channel(peer).post({ message });
}
export function listenOverlayMessages({ peer, handler, id }: ListenOverlayMessagesOptions) {
  return channel(peer).listen({
    handler,
    matches: (message) => id === undefined || message.id === id,
  });
}
