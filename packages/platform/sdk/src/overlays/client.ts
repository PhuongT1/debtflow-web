import { OVERLAY_PROTOCOL, type OverlayResult } from '@packages/platform-contracts';
import { emitOverlayMessage, listenOverlayMessages } from './channel';

import type { OpenPlatformOverlayOptions } from './overlay.types';
export type { OpenPlatformOverlayOptions } from './overlay.types';
/** Caller flow: open -> accepted -> result after the host's exit animation. */
export function openPlatformOverlay({
  request,
  hostOrigin,
  signal,
}: OpenPlatformOverlayOptions): Promise<OverlayResult> {
  return new Promise((resolve) => {
    const id = crypto.randomUUID();
    const peer = { target: window.parent, origin: hostOrigin };
    const send = (type: 'open' | 'abort') =>
      emitOverlayMessage({
        peer,
        message: { protocol: OVERLAY_PROTOCOL, id, type, ...(type === 'open' ? { request } : {}) },
      });
    const finish = (result: OverlayResult) => {
      window.clearTimeout(timeout);
      unsubscribe();
      signal?.removeEventListener('abort', abort);
      resolve(result);
    };
    const abort = () => {
      send('abort');
      finish({ status: 'cancelled' });
    };
    const unsubscribe = listenOverlayMessages({
      peer,
      id,
      handler: (message) => {
        if (message.type === 'accepted') window.clearTimeout(timeout);
        if (message.type === 'result') finish(message.result!);
      },
    });
    const timeout = window.setTimeout(() => {
      send('abort');
      finish({ status: 'failed' });
    }, 12000);
    signal?.addEventListener('abort', abort, { once: true });
    if (signal?.aborted) abort();
    else {
      try {
        send('open');
      } catch {
        finish({ status: 'failed' });
      }
    }
  });
}
