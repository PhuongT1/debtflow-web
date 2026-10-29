import { OVERLAY_PROTOCOL } from '@packages/platform-contracts';
import { emitOverlayMessage, listenOverlayMessages } from './channel';

import type {
  OverlaySurfaceOptions,
  OverlaySurfaceMeasurement,
  OverlaySurfaceCompletion,
} from './overlay.types';

/** Bind each logical request to its own result without reloading the content runtime. */
export function connectOverlaySurface(options: OverlaySurfaceOptions) {
  const peer = { target: window.parent, origin: options.hostOrigin };
  let activeId: string | undefined;
  let finished = false;
  const emit = (id: string, type: 'presented' | 'resize' | 'result', extra = {}) => {
    if (id !== activeId || finished) return false;
    if (activeId)
      emitOverlayMessage({
        peer,
        message: { protocol: OVERLAY_PROTOCOL, id: activeId, type, ...extra },
      });
    if (type === 'result') finished = true;
    return true;
  };
  const unsubscribe = listenOverlayMessages({
    peer,
    handler: (message) => {
      if (message.type === 'init') {
        if (message.id === activeId) return;
        activeId = message.id;
        finished = false;
        options.onInit({ id: message.id, request: message.request!, locale: message.locale });
      }
      if (message.id !== activeId) return;
      if (message.type === 'close-request') options.onCloseRequest();
      if (message.type === 'activate') options.onActivate?.();
    },
  });
  emitOverlayMessage({
    peer,
    message: { protocol: OVERLAY_PROTOCOL, id: options.id, type: 'ready' },
  });
  return {
    present: ({ id, height }: OverlaySurfaceMeasurement) => emit(id, 'presented', { height }),
    resize: ({ id, height }: OverlaySurfaceMeasurement) => emit(id, 'resize', { height }),
    finish: ({ id, result }: OverlaySurfaceCompletion) => emit(id, 'result', { result }),
    dispose: unsubscribe,
  };
}
