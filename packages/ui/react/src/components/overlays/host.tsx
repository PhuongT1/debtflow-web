'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, CircularProgress, Snackbar } from '@mui/material';

import { type OverlayResult } from '@packages/platform-contracts';
import {
  createOverlayHostBridge,
  type OverlayRuntime,
  type OverlaySession,
} from '@packages/platform-sdk';
import { getStoredLocale } from '@packages/platform-sdk';

import { PlatformDialog } from './dialog';
import type { OverlayHostProps } from './overlay.types';

/** React UI adapter. The SDK owns the framework-independent message state machine. */
export function OverlayHost({
  owner,
  ownerWindow,
  views,
  closeLabel,
  loadingLabel,
}: OverlayHostProps) {
  const viewKey = JSON.stringify(Object.entries(views).sort(([a], [b]) => a.localeCompare(b)));
  const viewEntries = useMemo(() => JSON.parse(viewKey) as Array<[string, string]>, [viewKey]);
  const [runtime, setRuntime] = useState<OverlayRuntime>();
  const [session, setSession] = useState<OverlaySession>();
  const [height, setHeight] = useState(240);
  const [visible, setVisible] = useState(false);
  const [presented, setPresented] = useState(false);
  const ready = useRef(false);
  const surfaceFrame = useRef<HTMLIFrameElement | null>(null);
  const bridge = useRef<ReturnType<typeof createOverlayHostBridge> | null>(null);
  const pendingResult = useRef<OverlayResult | null>(null);
  const ended = () => {
    if (pendingResult.current) bridge.current?.complete({ result: pendingResult.current });
    pendingResult.current = null;
    ready.current = false;
    setPresented(false);
    setSession(undefined);
  };
  useEffect(() => {
    const target = ownerWindow ?? owner?.current?.contentWindow;
    if (!target) return;
    // Only a semantic registration change replaces the session, not a parent re-render.
    ready.current = false;
    pendingResult.current = null;
    setVisible(false);
    setPresented(false);
    setSession(undefined);
    const host = createOverlayHostBridge({
      owner: {
        target,
        origin: ownerWindow ? location.origin : new URL(owner!.current!.src, location.href).origin,
      },
      views: Object.fromEntries(viewEntries),
      baseUrl: location.href,
      getSurfaceWindow: () => surfaceFrame.current?.contentWindow ?? null,
      getLocale: getStoredLocale,
      onRuntime: (value) => setRuntime(value),
      // Mount the registered content hidden; transport readiness is not UI readiness.
      onOpen: (next) => {
        ready.current = false;
        setHeight(Math.max(160, window.innerHeight - 64));
        setPresented(false);
        setVisible(false);
        setSession(next);
      },
      // Only reveal after the remote rendered and measured its real content.
      onPresent: ({ height }) => {
        setHeight(Math.max(160, height));
        ready.current = true;
        setPresented(true);
        setVisible(true);
      },
      onResize: ({ height }) => setHeight(Math.max(160, height)),
      // Preserve content through exit; ended() completes the caller request.
      onFinish: (result) => {
        if (ready.current) {
          pendingResult.current = result;
          setVisible(false);
        } else {
          host.complete({ result });
          setSession(undefined);
        }
      },
    });
    bridge.current = host;
    return () => {
      host.dispose();
      bridge.current = null;
    };
  }, [owner, ownerWindow, viewEntries]);
  return (
    <>
      <Snackbar
        open={!!session && !presented}
        message={
          <>
            <CircularProgress size={14} sx={{ mr: 1 }} />
            {loadingLabel}
          </>
        }
        action={
          <Button color="inherit" onClick={() => bridge.current?.requestClose()}>
            {closeLabel}
          </Button>
        }
      />
      <PlatformDialog
        keepMounted
        open={visible}
        fullWidth
        maxWidth={session?.request.size ?? 'md'}
        onClose={() => bridge.current?.requestClose()}
        aria-label={session?.request.title}
        slotProps={{ transition: { onEntered: () => bridge.current?.activate(), onExited: ended } }}
      >
        {runtime && (
          <iframe
            key={runtime.id}
            data-overlay-session={session?.id ?? 'idle'}
            data-overlay-runtime={runtime.id}
            ref={(node) => {
              surfaceFrame.current = node;
              if (node?.contentWindow)
                bridge.current?.attachSurface({ target: node.contentWindow });
            }}
            src={runtime.url}
            title={session?.request.title ?? loadingLabel}
            style={{
              border: 0,
              display: 'block',
              width: '100%',
              height: `min(${height}px, calc(100dvh - 64px))`,
            }}
          />
        )}
      </PlatformDialog>
    </>
  );
}
