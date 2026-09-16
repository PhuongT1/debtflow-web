'use client';

import { useEffect, useRef, useState } from 'react';
import { getStoredLocale, MFE_HOST_MESSAGE_VERSION } from '@debtflow/contracts';
import { subscribePlatformEvent } from '@debtflow/platform-sdk';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { RemoteErrorState, RemoteLoadingState, type RemoteHostState } from './remote-host-state';

export { WebComponentHost } from './web-component-host';

type IframeHostProps = {
  appName: string;
  src: string;
  title: string;
};

export function IframeHost({ appName, src, title }: IframeHostProps) {
  const router = useRouter();
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

      if (
        event.data.type === 'debtflow:navigate' &&
        typeof event.data.path === 'string' &&
        event.data.path.startsWith('/')
      ) {
        router.push(event.data.path);
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
  }, [appName, attempt, router, src]);

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
        src={src}
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
