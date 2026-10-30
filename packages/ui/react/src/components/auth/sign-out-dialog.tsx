'use client';

import { useId, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import type { SignOutDialogProps } from './dialog.types';

/** Mount while confirmation is requested; the host supplies translated text and the action. */
export function SignOutDialog({
  title,
  confirmation,
  cancelLabel,
  errorMessage,
  onCancel,
  onConfirm,
}: SignOutDialogProps) {
  const id = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function confirm() {
    if (isPending) return;
    setIsPending(true);
    setHasError(false);
    try {
      await onConfirm();
    } catch {
      setHasError(true);
      setIsPending(false);
    }
  }

  return (
    <Dialog
      open
      fullWidth
      maxWidth="xs"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onClose={() => {
        if (!isPending) onCancel();
      }}
      slotProps={{ transition: { onEntered: () => cancelRef.current?.focus() } }}
    >
      <DialogTitle id={`${id}-title`}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id={`${id}-description`}>{confirmation}</DialogContentText>
        {hasError ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          ref={cancelRef}
          autoFocus
          variant="outlined"
          disabled={isPending}
          onClick={onCancel}
        >
          {cancelLabel}
        </Button>
        <Button color="error" variant="contained" loading={isPending} onClick={confirm}>
          {title}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
