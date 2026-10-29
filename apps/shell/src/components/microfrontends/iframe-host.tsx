'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getStoredLocale,
  isMfeRoutePath,
  MFE_HOST_MESSAGE_VERSION,
  MFE_ROUTE_SYNC_CAPABILITY,
} from '@packages/platform-contracts';
import { subscribePlatformEvent } from '@packages/platform-sdk';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Box } from '@mui/material';
import { RemoteErrorState, RemoteLoadingState, type RemoteHostState } from './remote-host-state';

type IframeHostProps = {
  appName: string;
  src: string;
  title: string;
  publicPath: string;
  entryPath: string;
};

export function IframeHost({ appName, src, title, publicPath, entryPath }: IframeHostProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // The iframe document is a runtime, not the navigation state. Route changes
  // are messages; changing this src would destroy its cache and history.
  const [initialSrc] = useState(src);
  const [routeSync, setRouteSync] = useState(false);
  const routeSyncRef = useRef(false);
  const documentSrc = routeSync ? initialSrc : src;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<RemoteHostState>({ status: 'loading' });

  useEffect(() => {
    setState({ status: 'loading' });
    const timeout = window.setTimeout(() => {
      setState({
        status: 'error',
        message: 'Micro frontend did not report ready state in time.',
      });
    }, 10_000);

    function onMessage(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== iframeRef.current?.contentWindow ||
        event.data?.source !== appName ||
        event.data?.version !== MFE_HOST_MESSAGE_VERSION
      ) {
        return;
      }

      if (event.data.type === 'debtflow:ready') {
        window.clearTimeout(timeout);
        const supported =
          Array.isArray(event.data.capabilities) &&
          event.data.capabilities.includes(MFE_ROUTE_SYNC_CAPABILITY);
        routeSyncRef.current = supported;
        setRouteSync(supported);
        iframeRef.current?.contentWindow?.postMessage(
          {
            source: 'platform',
            version: MFE_HOST_MESSAGE_VERSION,
            type: 'debtflow:locale-changed',
            locale: getStoredLocale(),
          },
          window.location.origin,
        );
        setState({ status: 'ready' });
        return;
      }

      if (event.data.type === 'debtflow:navigate' && isMfeRoutePath(event.data.path)) {
        const path = event.data.path;
        const target = new URL(path, window.location.origin);
        if (target.origin !== window.location.origin) return;
        if (
          routeSyncRef.current &&
          (target.pathname === publicPath || target.pathname.startsWith(publicPath + '/'))
        ) {
          const current = window.location.pathname + window.location.search + window.location.hash;
          if (path !== current) window.history.pushState(null, '', path);
        } else {
          router.push(path);
        }
      }
    }

    window.addEventListener('message', onMessage);
    const unsubscribeLocale = subscribePlatformEvent('locale:changed', ({ locale }) => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          source: 'platform',
          version: MFE_HOST_MESSAGE_VERSION,
          type: 'debtflow:locale-changed',
          locale,
        },
        window.location.origin,
      );
    });

    return () => {
      unsubscribeLocale();
      window.clearTimeout(timeout);
      window.removeEventListener('message', onMessage);
    };
  }, [appName, attempt, router, publicPath, documentSrc]);

  useEffect(() => {
    if (state.status !== 'ready' || !routeSync) return;
    const syncRoute = () => {
      const target = new URL(window.location.href);
      if (target.pathname !== publicPath && !target.pathname.startsWith(publicPath + '/')) return;
      iframeRef.current?.contentWindow?.postMessage(
        {
          source: 'platform',
          version: MFE_HOST_MESSAGE_VERSION,
          type: 'debtflow:route-changed',
          path: entryPath + target.pathname.slice(publicPath.length) + target.search + target.hash,
        },
        window.location.origin,
      );
    };
    syncRoute();
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, [entryPath, publicPath, pathname, searchParams, state.status, routeSync]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100dvh - 80px)',
        position: 'relative',
        width: '100%',
      }}
    >
      {state.status === 'loading' ? <RemoteLoadingState label="Đang tải micro frontend…" /> : null}
      {state.status === 'error' ? (
        <RemoteErrorState message={state.message} retry={() => setAttempt((value) => value + 1)} />
      ) : null}
      <Box
        component="iframe"
        key={attempt}
        onError={() =>
          setState({
            status: 'error',
            message: 'Không thể tải micro frontend.',
          })
        }
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
