'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { alpha, Box, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppDialog } from '@/components/ui/dialog/dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@packages/ui-react';

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
}: {
  onConfirm: () => Promise<unknown>;
  label?: string;
  confirmMessage?: string;
  title?: string;
  intent?: ConfirmIntent;
  isPending: boolean;
  error: Error | null;
  onReset: () => void;
}) {
  const t = useTranslations('ConfirmAction');
  const [open, setOpen] = useState(false);
  const { showToast } = useToast();
  const config = intentConfig[intent];
  async function confirm() {
    try {
      await onConfirm();
      setOpen(false);
      showToast({ message: t('success', { action: label ?? t('delete') }) });
    } catch {
      // The domain mutation retains the error for the retry dialog.
    }
  }

  return (
    <>
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
      <AppDialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={() => (isPending ? undefined : setOpen(false))}
      >
        <DialogTitle>
          <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.5 }}>
            <Box
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: alpha(theme.palette[config.color].main, 0.1),
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
          <Button disabled={isPending} onClick={() => setOpen(false)} variant="secondary">
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
