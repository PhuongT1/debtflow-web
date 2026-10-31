'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { useToast } from '@packages/ui-react';

import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { AppDialog } from '@/components/ui/dialog/dialog';
import { apiClient } from '@/lib/api/client';

import type { ConfirmActionButtonProps, IntentIconProps } from './confirm-action-button.types';

export type ConfirmIntent = 'delete' | 'warning' | 'info';

function IntentIcon({ intent }: IntentIconProps) {
  return (
    <AppIcon name={intent === 'delete' ? 'delete' : intent === 'warning' ? 'warning' : 'info'} />
  );
}

export function ConfirmActionButton({
  endpoint,
  label: labelInput,
  confirmMessage: confirmMessageInput,
  title,
  intent = 'delete',
  invalidateQueryKey,
  refreshRoute = true,
}: ConfirmActionButtonProps) {
  const ui = useTranslations('Workspace');
  const label = labelInput ?? ui('delete');
  const confirmMessage = confirmMessageInput ?? ui('areYouSureYouWantToDeleteThisRecord');

  const intentConfig: Record<
    ConfirmIntent,
    { color: 'error' | 'warning' | 'primary'; title: string }
  > = {
    delete: { color: 'error', title: ui('confirmDeletion') },
    warning: { color: 'warning', title: ui('confirmAction') },
    info: { color: 'primary', title: ui('confirm') },
  };

  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const config = intentConfig[intent];
  const mutation = useMutation({
    mutationFn: () => apiClient.delete(endpoint),
    onSuccess: () => {
      setOpen(false);
      showToast({ message: ui('actionSucceeded', { value1: label }) });
      if (invalidateQueryKey) void queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      if (refreshRoute) router.refresh();
    },
  });

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="small"
        startIcon={<IntentIcon intent={intent} />}
        tone={config.color}
        variant="secondary"
      >
        {label}
      </Button>
      <AppDialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={() => (mutation.isPending ? undefined : setOpen(false))}
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
                {title ?? config.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {ui('pleaseConfirmBeforeContinuing')}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2 }}>
          <Typography>{confirmMessage}</Typography>
          <ApiErrorNotice error={mutation.error} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button disabled={mutation.isPending} onClick={() => setOpen(false)} variant="secondary">
            {ui('cancel')}
          </Button>
          <Button
            loading={mutation.isPending}
            onClick={() => mutation.mutate()}
            tone={config.color}
          >
            {label}
          </Button>
        </DialogActions>
      </AppDialog>
    </>
  );
}
