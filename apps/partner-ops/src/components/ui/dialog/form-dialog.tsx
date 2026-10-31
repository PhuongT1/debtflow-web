'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTranslations } from 'next-intl';

import { useOverlaySurface } from '@packages/ui-react';

import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { AppDialog } from '@/components/ui/dialog/dialog';

import type { FormDialogProps, SetGuardGuardOptions } from './form-dialog.types';

const FormDialogContext = createContext<{
  closeDialog: (message?: string, data?: Record<string, unknown>) => void;
  setGuard: (guard: SetGuardGuardOptions) => void;
}>({
  closeDialog: () => undefined,
  setGuard: () => undefined,
});

export function useFormDialog() {
  return useContext(FormDialogContext);
}

export function FormDialog({
  buttonLabel,
  buttonIcon,
  buttonSize = 'medium',
  buttonVariant = 'primary',
  iconOnly = false,
  title,
  description,
  children,
  remote,
  onCompleted,
  surface = false,
}: FormDialogProps) {
  const t = useTranslations('Common');
  const overlay = useOverlaySurface();
  const [open, setOpen] = useState(surface);
  const [guard, setGuard] = useState({ dirty: false, pending: false });
  const [discard, setDiscard] = useState(false);
  const closeNow = () => {
    setOpen(false);
    overlay?.finish({ status: 'cancelled' });
  };
  const close = () => {
    if (guard.pending) return;
    if (guard.dirty) setDiscard(true);
    else closeNow();
  };
  const dialogContext = useMemo(
    () => ({
      setGuard,
      closeDialog: (message?: string, data?: Record<string, unknown>) => {
        setOpen(false);
        overlay?.finish({ status: 'completed', message, ...(data ? { data } : {}) });
      },
    }),
    [overlay],
  );
  const triggerIcon = buttonIcon ?? 'add';
  const trigger = iconOnly ? (
    <Tooltip title={buttonLabel}>
      <IconButton
        aria-label={buttonLabel}
        color={buttonVariant === 'danger' ? 'error' : 'primary'}
        onClick={() => setOpen(true)}
        size={buttonSize}
      >
        <AppIcon fontSize="small" name={triggerIcon} />
      </IconButton>
    </Tooltip>
  ) : (
    <Button
      size={buttonSize}
      startIcon={<AppIcon fontSize="small" name={triggerIcon} />}
      type="button"
      variant={buttonVariant}
      onClick={() => setOpen(true)}
    >
      {buttonLabel}
    </Button>
  );

  return (
    <>
      {!surface && trigger}
      <AppDialog
        surfaceBody={surface}
        fullWidth
        maxWidth="md"
        open={open}
        onClose={close}
        remote={remote}
        onCompleted={onCompleted}
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Typography component="div" sx={{ fontSize: 20, fontWeight: 900 }}>
            {title}
          </Typography>
          {description ? (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          ) : null}
          <IconButton
            aria-label={t('close')}
            onClick={close}
            sx={{ position: 'absolute', right: 12, top: 12 }}
          >
            <AppIcon fontSize="small" name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'background.default', borderColor: 'divider' }} dividers>
          <FormDialogContext.Provider value={dialogContext}>{children}</FormDialogContext.Provider>
        </DialogContent>
      </AppDialog>
      <AppDialog open={discard} onClose={() => setDiscard(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('discardTitle')}</DialogTitle>
        <DialogContent>{t('discardDescription')}</DialogContent>
        <DialogActions>
          <Button variant="secondary" onClick={() => setDiscard(false)}>
            {t('keepEditing')}
          </Button>
          <Button
            tone="error"
            onClick={() => {
              setDiscard(false);
              closeNow();
            }}
          >
            {t('discard')}
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
}
