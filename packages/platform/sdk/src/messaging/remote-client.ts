import { MFE_HOST_MESSAGE_VERSION, isMfePlatformMessage } from '@packages/platform-contracts';
import { createWindowMessenger } from './window-messenger';
import type {
  RemoteClientOptions,
  RemoteClientListeners,
  PlatformLocaleOptions,
  PlatformRouteOptions,
} from './messaging.types';

/** Shell-side counterpart of createPlatformClient: one instance per mounted remote. */
export function createRemoteClient(options: RemoteClientOptions) {
  const messages = createWindowMessenger({
    getPeer: options.getPeer,
    validate: isMfePlatformMessage,
  });
  return {
    requestReady() {
      return messages.post({
        message: {
          source: 'platform',
          version: MFE_HOST_MESSAGE_VERSION,
          type: 'debtflow:ready-request',
        },
      });
    },
    listen({ onReady, onNavigate }: RemoteClientListeners) {
      return messages.listen({
        matches: (message) => message.source === options.source,
        handler: (message) => {
          if (message.type === 'debtflow:ready')
            onReady({ capabilities: message.capabilities ?? [] });
          if (message.type === 'debtflow:navigate') onNavigate({ path: message.path });
        },
      });
    },
    setLocale({ locale }: PlatformLocaleOptions) {
      return messages.post({
        message: {
          source: 'platform',
          version: MFE_HOST_MESSAGE_VERSION,
          type: 'debtflow:locale-changed',
          locale,
        },
      });
    },
    setRoute({ path }: PlatformRouteOptions) {
      return messages.post({
        message: {
          source: 'platform',
          version: MFE_HOST_MESSAGE_VERSION,
          type: 'debtflow:route-changed',
          path,
        },
      });
    },
  };
}
