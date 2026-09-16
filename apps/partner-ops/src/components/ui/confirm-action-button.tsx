'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { alpha, Box, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { ApiErrorNotice } from '@/components/ui/api-error-notice';
import { AppDialog } from '@/components/ui/app-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';
import { useToast } from '@debtflow/react-ui';
import { requestJson } from '@/lib/api-client';

type ConfirmIntent = 'delete' | 'warning' | 'info';

const intentConfig: Record<
  ConfirmIntent,
  { color: 'error' | 'warning' | 'primary'; title: string }
> = {
  delete: { color: 'error', title: 'Xác nhận xóa' },
  warning: { color: 'warning', title: 'Xác nhận thao tác' },
  info: { color: 'primary', title: 'Xác nhận' },
};

function IntentIcon({ intent }: { intent: ConfirmIntent }) {
  return (
    <AppIcon name={intent === 'delete' ? 'delete' : intent === 'warning' ? 'warning' : 'info'} />
  );
}

export function ConfirmActionButton({
  endpoint,
  label = 'Xóa',
  confirmMessage = 'Bạn chắc chắn muốn xóa dữ liệu này?',
  title,
  intent = 'delete',
  invalidateQueryKey,
  refreshRoute = true,
}: {
  endpoint: string;
  label?: string;
  confirmMessage?: string;
  title?: string;
  intent?: ConfirmIntent;
  invalidateQueryKey?: readonly unknown[];
  refreshRoute?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const config = intentConfig[intent];
  const mutation = useMutation({
    mutationFn: () => requestJson(endpoint, { method: 'DELETE' }),
    onSuccess: () => {
      setOpen(false);
      showToast({ message: `${label} dữ liệu thành công.` });
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
                {title ?? config.title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                Thao tác này cần bạn xác nhận trước khi tiếp tục.
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
            Hủy
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
