import { OVERLAY_PROTOCOL, type OverlayResult } from '@packages/platform-contracts';

import { emitOverlayMessage, listenOverlayMessages } from './channel';
import type {
  OverlayCompletionOptions,
  OverlayHostBridgeOptions,
  OverlayRuntime,
  OverlaySession,
  OverlaySurfaceTarget,
} from './overlay.types';
export type { OverlayRuntime, OverlaySession } from './overlay.types';

/** Reuse one prepared content runtime for successive logical requests. */
export function createOverlayHostBridge(options: OverlayHostBridgeOptions) {
  let active: OverlaySession | undefined;
  let runtime: OverlayRuntime | undefined;
  let route = '';
  let runtimeReady = false;
  let closing = false;
  let presented = false;
  let loadTimer: ReturnType<typeof setTimeout> | undefined;
  let unsubscribeSurface: (() => void) | undefined;
  const ownerSend = (id: string, type: 'accepted' | 'result', result?: OverlayResult) =>
    emitOverlayMessage({
      peer: options.owner,
      message: { protocol: OVERLAY_PROTOCOL, id, type, ...(result ? { result } : {}) },
    });
  const prepare = (path: string, force = false) => {
    const url = new URL(path, options.baseUrl);
    if (!['https:', 'http:'].includes(url.protocol)) return false;
    if (!force && route === url.href) return true;
    unsubscribeSurface?.();
    route = url.href;
    runtimeReady = false;
    const id = crypto.randomUUID();
    url.searchParams.set('runtime', id);
    runtime = { id, url: url.href };
    options.onRuntime?.(runtime);
    return true;
  };
  const finish = (result: OverlayResult) => {
    if (!active || closing) return;
    closing = true;
    clearTimeout(loadTimer);
    options.onFinish(result);
  };
  const surfaceSend = (type: 'init' | 'activate' | 'close-request') => {
    const target = options.getSurfaceWindow();
    if (!active || !target || !runtimeReady || !runtime) return;
    emitOverlayMessage({
      peer: { target, origin: new URL(runtime.url).origin },
      message: {
        protocol: OVERLAY_PROTOCOL,
        id: active.id,
        type,
        ...(type === 'init' ? { request: active.request, locale: options.getLocale() } : {}),
      },
    });
  };
  const unsubscribeOwner = listenOverlayMessages({
    peer: options.owner,
    handler: (message) => {
      if (message.type === 'abort' && message.id === active?.id) {
        finish({ status: 'cancelled' });
        return;
      }
      if (message.type !== 'open') return;
      const request = message.request!;
      const path = Object.hasOwn(options.views, request.view)
        ? options.views[request.view]
        : undefined;
      // Cancel additional clicks without interrupting the active dialog or reporting a failure.
      if (active) {
        ownerSend(message.id, 'result', { status: 'cancelled' });
        return;
      }
      if (!path || !prepare(path) || !runtime) {
        ownerSend(message.id, 'result', { status: 'failed' });
        return;
      }
      active = { id: message.id, request, url: runtime.url };
      closing = false;
      presented = false;
      ownerSend(message.id, 'accepted');
      loadTimer = setTimeout(() => finish({ status: 'failed' }), 15000);
      options.onOpen(active);
      surfaceSend('init');
    },
  });
  // Prepare alongside the main remote page, before the first modal click.
  const initialPath = Object.values(options.views)[0];
  if (initialPath) prepare(initialPath);
  return {
    get runtime() {
      return runtime;
    },
    attachSurface({ target }: OverlaySurfaceTarget) {
      unsubscribeSurface?.();
      if (!runtime) return;
      const runtimeId = runtime.id;
      unsubscribeSurface = listenOverlayMessages({
        peer: { target, origin: new URL(runtime.url).origin },
        handler: (message) => {
          if (message.type === 'ready' && message.id === runtimeId) {
            runtimeReady = true;
            if (active && !closing) surfaceSend('init');
            return;
          }
          if (!active || closing || message.id !== active.id) return;
          if (message.type === 'presented' && !presented) {
            presented = true;
            clearTimeout(loadTimer);
            options.onPresent({ height: message.height! });
          }
          if (message.type === 'resize' && presented) options.onResize({ height: message.height! });
          if (message.type === 'result') finish(message.result!);
        },
      });
    },
    activate: () => surfaceSend('activate'),
    requestClose() {
      if (presented) surfaceSend('close-request');
      else finish({ status: 'cancelled' });
    },
    /** Only clear the logical request. Keep the loaded frame and its query cache. */
    complete({ result }: OverlayCompletionOptions) {
      if (!active) return;
      ownerSend(active.id, 'result', result);
      active = undefined;
      clearTimeout(loadTimer);
      if (result.status === 'failed' && !presented) prepare(route, true);
    },
    dispose() {
      unsubscribeOwner();
      unsubscribeSurface?.();
      clearTimeout(loadTimer);
      if (active) ownerSend(active.id, 'result', { status: 'cancelled' });
      active = undefined;
    },
  };
}
