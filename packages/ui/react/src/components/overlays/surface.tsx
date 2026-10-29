'use client';
import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useLayoutEffect,
  useState,
  useRef,
} from 'react';
import type { OverlayRequest } from '@packages/platform-contracts';
import { connectOverlaySurface, setStoredLocale } from '@packages/platform-sdk';

import type { OverlaySurfaceProps, OverlaySurfaceContextValue } from './overlay.types';

const SurfaceContext = createContext<OverlaySurfaceContextValue | null>(null);
export const useOverlaySurface = () => useContext(SurfaceContext);

/** React adapter only. Angular/Vue use the same connectOverlaySurface transport. */
export function OverlaySurface({
  hostOrigin,
  children,
  deferPresentation = false,
}: OverlaySurfaceProps) {
  const content = useRef<HTMLDivElement>(null);
  const connection = useRef<ReturnType<typeof connectOverlaySurface> | null>(null);
  const [contentReady, setContentReady] = useState(!deferPresentation);
  const markReady = useCallback(() => setContentReady(true), []);
  const [requestId, setRequestId] = useState('');
  const [request, setRequest] = useState<OverlayRequest>();
  const [closeVersion, setCloseVersion] = useState(0);
  const [active, setActive] = useState(false);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('runtime') ?? query.get('request') ?? '';
    const client = connectOverlaySurface({
      hostOrigin,
      id,
      onInit: ({ id: nextId, request: input, locale }) => {
        setRequestId(nextId);
        setClosing(false);
        setActive(false);
        setCloseVersion(0);
        setContentReady(!deferPresentation);
        if (locale) setStoredLocale(locale);
        setRequest(input);
      },
      onCloseRequest: () => setCloseVersion((value) => value + 1),
      onActivate: () => setActive(true),
    });
    connection.current = client;
    return () => {
      client.dispose();
      connection.current = null;
    };
  }, [hostOrigin, deferPresentation]);
  useLayoutEffect(() => {
    const node = content.current;
    if (!request || !node || !contentReady) return;
    let disposed = false;
    let observer: ResizeObserver;
    // Fonts and the initial content layout must settle before the host reveals the dialog.
    void document.fonts.ready.then(() => {
      if (disposed) return;
      const measure = () => Math.ceil(node.getBoundingClientRect().height);
      connection.current?.present({ id: requestId, height: measure() });
      observer = new ResizeObserver(() =>
        connection.current?.resize({ id: requestId, height: measure() }),
      );
      observer.observe(node);
    });
    return () => {
      disposed = true;
      observer?.disconnect();
    };
  }, [request, contentReady, requestId]);
  // Allow the domain to warm read-only queries before the first request.
  if (!request) return children;
  return (
    <SurfaceContext.Provider
      value={{
        request,
        closeVersion,
        active,
        closing,
        markReady,
        finish: (result) => {
          if (closing) return;
          if (connection.current?.finish({ id: requestId, result })) setClosing(true);
        },
      }}
    >
      <div ref={content} key={requestId}>
        {children}
      </div>
    </SurfaceContext.Provider>
  );
}
