'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@mui/material';

import { MFE_ROUTE_SYNC_CAPABILITY } from '@packages/platform-contracts';
import { getStoredLocale } from '@packages/platform-sdk';
import { createRemoteClient, subscribePlatformEvent } from '@packages/platform-sdk';

import type { IframeHostProps } from './microfrontends.types';
import { OverlayHost } from './overlay-host';
import { RemoteErrorState, type RemoteHostState, RemoteLoadingState } from './remote-host-state';

export function IframeHost({
  appName,
  src,
  title,
  publicPath,
  entryPath,
  loadingFallback,
  overlayViews,
}: IframeHostProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // Preserve the iframe document and its cache while synchronizing routes through messages.
  const [initialSrc] = useState(src);
  const [routeSync, setRouteSync] = useState(false);
  const routeSyncRef = useRef(false);
  const documentSrc = routeSync ? initialSrc : src;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Register host callbacks here while the SDK owns message validation and dispatch.
  const remote = useMemo(
    () =>
      createRemoteClient({
        source: appName,
        getPeer: () => {
          const target = iframeRef.current?.contentWindow;
          return target
            ? { target, origin: new URL(documentSrc, window.location.href).origin }
            : null;
        },
      }),
    [appName, documentSrc],
  );
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RemoteHostState>({ status: 'loading' });

  useEffect(() => {
    setState({ status: 'loading' });
    const readinessProbe = window.setInterval(() => remote.requestReady(), 500);
    const timeout = window.setTimeout(() => {
      window.clearInterval(readinessProbe);
      setState({
        status: 'error',
        message: 'Micro frontend did not report ready state in time.',
      });
    }, 10_000);

    const unsubscribeMessages = remote.listen({
      onReady: ({ capabilities }) => {
        window.clearTimeout(timeout);
        window.clearInterval(readinessProbe);
        const supported = capabilities.includes(MFE_ROUTE_SYNC_CAPABILITY);
        routeSyncRef.current = supported;
        setRouteSync(supported);
        remote.setLocale({ locale: getStoredLocale() });
        setState({ status: 'ready' });
      },
      onNavigate: ({ path }) => {
        const target = new URL(path, window.location.origin);
        if (target.origin !== window.location.origin) return;
        if (
          routeSyncRef.current &&
          (target.pathname === publicPath || target.pathname.startsWith(publicPath + '/'))
        ) {
          const current = window.location.pathname + window.location.search + window.location.hash;
          if (path !== current) window.history.pushState(null, '', path);
        } else router.push(path);
      },
    });
    // Recover a ready notification sent before the host listener was attached.
    remote.requestReady();
    const unsubscribeLocale = subscribePlatformEvent('locale:changed', ({ locale }) =>
      remote.setLocale({ locale }),
    );

    return () => {
      unsubscribeLocale();
      window.clearTimeout(timeout);
      window.clearInterval(readinessProbe);
      unsubscribeMessages();
    };
  }, [attempt, router, publicPath, remote]);

  useEffect(() => {
    if (state.status !== 'ready' || !routeSync) return;
    const syncRoute = () => {
      const target = new URL(window.location.href);
      if (target.pathname !== publicPath && !target.pathname.startsWith(publicPath + '/')) return;
      remote.setRoute({
        path: entryPath + target.pathname.slice(publicPath.length) + target.search + target.hash,
      });
    };
    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [entryPath, publicPath, pathname, searchParams, state.status, routeSync, remote]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100dvh - 80px)',
        position: 'relative',
        width: '100%',
      }}
    >
      {state.status === 'loading' ? (
        <RemoteLoadingState>{loadingFallback}</RemoteLoadingState>
      ) : null}
      {state.status === 'error' ? (
        <RemoteErrorState message={state.message} retry={() => setAttempt((value) => value + 1)} />
      ) : null}
      {/* A retry creates a new iframe window, so its overlay session must rebind too. */}
      <OverlayHost key={`overlay-${attempt}`} owner={iframeRef} views={overlayViews} />
      <Box
        component="iframe"
        key={`remote-${attempt}`}
        onError={() =>
          setState({
            status: 'error',
            message: 'Không thể tải micro frontend.',
          })
        }
        onLoad={() => remote.requestReady()}
        ref={iframeRef}
        src={documentSrc}
        title={title}
        sx={{
          border: 0,
          display: state.status === 'ready' ? 'block' : 'none',
          height: 'calc(100dvh - 80px)',
          width: '100%',
        }}
      />
    </Box>
  );
}
