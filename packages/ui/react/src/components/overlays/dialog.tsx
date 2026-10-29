'use client';
import { useEffect, useRef, useState } from 'react';
import { Box, Dialog, Alert, Snackbar } from '@mui/material';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import { openPlatformOverlay } from '@packages/platform-sdk';
import { DialogTransition } from './transition';
import { useOverlaySurface } from './surface';

import type { PlatformDialogProps } from './overlay.types';
export type { PlatformDialogProps } from './overlay.types';

/** Shared entry: local Dialog standalone; host-managed surface when embedded. */
export function PlatformDialog({
  surfaceBody = false,
  remote,
  hostOrigin,
  openRemote,
  onCompleted,
  onFailure,
  errorLabel,
  ...props
}: PlatformDialogProps) {
  const surface = useOverlaySurface();
  const [embedded, setEmbedded] = useState(false);
  const [failed, setFailed] = useState(false);
  const latest = useRef({ props, remote, onCompleted, onFailure });
  latest.current = { props, remote, onCompleted, onFailure };
  useEffect(() => {
    setEmbedded(window.parent !== window);
  }, []);
  useEffect(() => {
    if (!props.open || !embedded || surface || !remote || (!hostOrigin && !openRemote)) return;
    setFailed(false);
    const controller = new AbortController();
    const trigger = document.activeElement as HTMLElement | null;
    // Delegate embedded requests to the app client while standalone dialogs render locally.
    const resultPromise = openRemote
      ? openRemote({ request: remote, signal: controller.signal })
      : openPlatformOverlay({
          request: remote,
          hostOrigin: hostOrigin!,
          signal: controller.signal,
        });
    void resultPromise.then((result) => {
      if (controller.signal.aborted) return;
      if (result.status === 'failed') {
        if (latest.current.onFailure) latest.current.onFailure();
        else setFailed(true);
      }
      if (result.status === 'completed') latest.current.onCompleted?.(result);
      latest.current.props.onClose?.({}, 'backdropClick');
      trigger?.focus();
    });
    return () => controller.abort();
  }, [props.open, embedded, surface, hostOrigin, openRemote, remote?.view]);
  useEffect(() => {
    if (surfaceBody && surface?.closeVersion) latest.current.props.onClose?.({}, 'escapeKeyDown');
  }, [surface?.closeVersion, surfaceBody]);
  if (surface && surfaceBody) {
    return props.open || surface.closing ? (
      <FocusTrap
        open={surface.active && !surface.closing}
        isEnabled={() => !document.querySelector('.MuiModal-root')}
      >
        <Box
          tabIndex={-1}
          sx={{ outline: 'none' }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              props.onClose?.(event, 'escapeKeyDown');
            }
          }}
        >
          {props.children}
        </Box>
      </FocusTrap>
    ) : null;
  }
  if (embedded && remote)
    return (
      <Snackbar open={failed} autoHideDuration={5000} onClose={() => setFailed(false)}>
        <Alert severity="error" onClose={() => setFailed(false)}>
          {errorLabel}
        </Alert>
      </Snackbar>
    );
  return (
    <Dialog
      transitionDuration={{ enter: 240, exit: 180 }}
      {...props}
      slots={{ transition: DialogTransition, ...props.slots }}
    />
  );
}
