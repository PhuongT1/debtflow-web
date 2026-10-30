'use client';

import { useState } from 'react';
import { Box, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import type { OverlayRequest } from '@packages/platform-contracts';
import { useOverlaySurface } from '@packages/ui-react';
import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { AppDialog } from '@/components/ui/dialog/dialog';

type ConfirmIntent = 'delete' | 'warning' | 'info';

const intentConfig: Record<
  ConfirmIntent,
  { color: 'error' | 'warning' | 'primary'; title: 'deleteTitle' | 'warningTitle' | 'infoTitle' }
> = {
  delete: { color: 'error', title: 'deleteTitle' },
  warning: { color: 'warning', title: 'warningTitle' },
  info: { color: 'primary', title: 'infoTitle' },
};

function IntentIcon({ intent }: { intent: ConfirmIntent }) {
  return (
    <AppIcon name={intent === 'delete' ? 'delete' : intent === 'warning' ? 'warning' : 'info'} />
  );
}

export function ConfirmActionButton({
  onConfirm,
  label,
  confirmMessage,
  title,
  intent = 'delete',
  isPending,
  error,
  onReset,
  remote,
  onCompleted,
  surface = false,
}: {
  onConfirm: () => Promise<unknown>;
  label?: string;
  confirmMessage?: string;
  title?: string;
  intent?: ConfirmIntent;
  isPending: boolean;
  error: Error | null;
  onReset: () => void;
  remote?: OverlayRequest;
  onCompleted?: () => void;
  surface?: boolean;
}) {
  const t = useTranslations('ConfirmAction');
  const overlay = useOverlaySurface();
  const [open, setOpen] = useState(surface);
  const close = () => {
    if (!isPending) {
      setOpen(false);
      overlay?.finish({ status: 'cancelled' });
    }
  };
  const { showToast } = useToast();
  const config = intentConfig[intent];
  async function confirm() {
    try {
      await onConfirm();
      setOpen(false);
      overlay?.finish({
        status: 'completed',
        message: t('success', { action: label ?? t('delete') }),
      });
      showToast({ message: t('success', { action: label ?? t('delete') }) });
    } catch {
      // The domain mutation retains the error for the retry dialog.
    }
  }

  return (
    <>
      {!surface && (
        <Button
          onClick={() => {
            onReset();
            setOpen(true);
          }}
          size="small"
          startIcon={<IntentIcon intent={intent} />}
          tone={config.color}
          variant="secondary"
        >
          {label ?? t('delete')}
        </Button>
      )}
      <AppDialog
        surfaceBody={surface}
        remote={remote}
        onCompleted={onCompleted}
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={close}
      >
        <DialogTitle>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5 }}>
            <Box
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: `color-mix(in srgb, ${(theme.vars ?? theme).palette[config.color].main} 10%, transparent)`,
                borderRadius: '50%',
                color: `${config.color}.main`,
                display: 'grid',
                height: 42,
                placeItems: 'center',
                width: 42,
              })}
            >
              <IntentIcon intent={intent} />
            </Box>
            <Box>
              <Typography component="div" sx={{ fontSize: 20, fontWeight: 900 }}>
                {title ?? t(config.title)}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {t('description')}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <Typography>{confirmMessage ?? t('message')}</Typography>
          <ApiErrorNotice error={error} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button disabled={isPending} onClick={close} variant="secondary">
            {t('cancel')}
          </Button>
          <Button loading={isPending} onClick={() => void confirm()} tone={config.color}>
            {label ?? t('delete')}
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
}
