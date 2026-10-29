import {
  MFE_HOST_MESSAGE_VERSION,
  isMfePlatformMessage,
  isMfeRoutePath,
} from '@packages/platform-contracts';
import { createWindowMessenger } from './window-messenger';
import type {
  PlatformClientOptions,
  PlatformRouteOptions,
  PlatformReadyOptions,
  PlatformClientListeners,
} from './messaging.types';
import type { OpenOverlayOptions } from '../overlays/overlay.types';
import { openPlatformOverlay } from '../overlays/client';

/** Create once at the application's composition root. No browser access until used. */
export function createPlatformClient(options: PlatformClientOptions) {
  const messages = createWindowMessenger({
    getPeer: () => ({ target: window.parent, origin: options.getHostOrigin() }),
    validate: isMfePlatformMessage,
  });
  const isEmbedded = () => typeof window !== 'undefined' && window.parent !== window;
  let ready: PlatformReadyOptions | undefined;
  const announceReady = ({ capabilities }: PlatformReadyOptions) => {
    ready = { capabilities: [...capabilities] };
    if (isEmbedded())
      messages.post({
        message: {
          source: options.source,
          version: MFE_HOST_MESSAGE_VERSION,
          type: 'debtflow:ready',
          capabilities: ready.capabilities,
        },
      });
  };
  return {
    isEmbedded,
    navigate({ path }: PlatformRouteOptions) {
      if (!isMfeRoutePath(path)) return false;
      if (isEmbedded()) {
        messages.post({
          message: {
            source: options.source,
            version: MFE_HOST_MESSAGE_VERSION,
            type: 'debtflow:navigate',
            path,
          },
        });
      } else window.location.assign(new URL(path, options.getHostOrigin()).href);
      return true;
    },
    announceReady,
    /** Install host handlers once at the embedded application's root; return teardown. */
    listen({ onLocale, onRoute }: PlatformClientListeners) {
      return messages.listen({
        matches: (message) => message.source === 'platform',
        handler: (message) => {
          if (message.type === 'debtflow:ready-request' && ready) announceReady(ready);
          if (message.type === 'debtflow:locale-changed') onLocale({ locale: message.locale });
          if (message.type === 'debtflow:route-changed') onRoute({ path: message.path });
        },
      });
    },
    /** Modal requests use the same window dispatcher as navigation and locale. */
    openOverlay({ request, signal }: OpenOverlayOptions) {
      return openPlatformOverlay({ request, hostOrigin: options.getHostOrigin(), signal });
    },
  };
}
