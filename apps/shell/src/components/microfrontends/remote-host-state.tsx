import type { RemoteLoadingStateProps, RemoteErrorStateProps } from './microfrontends.types';
export type { RemoteHostState } from './microfrontends.types';
import { Alert, Box, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import { FormPageSkeleton, TablePageSkeleton } from '@/components/skeletons/page-skeleton';

/** Initial page placeholder; embedded pages own subsequent data-loading states. */
export function RemoteLoadingState({ kind = 'table', children }: RemoteLoadingStateProps) {
  const t = useTranslations('PageState');
  return (
    <Box
      data-remote-loading
      aria-busy="true"
      role="status"
      aria-label={t('loading')}
      sx={{ minHeight: 320, height: 'calc(100dvh - 80px)', width: '100%' }}
    >
      {children ??
        (kind === 'form' ? (
          <FormPageSkeleton label={t('loading')} />
        ) : (
          <TablePageSkeleton label={t('loading')} />
        ))}
    </Box>
  );
}

export function RemoteErrorState({ message, retry }: RemoteErrorStateProps) {
  return (
    <Alert
      action={
        <Button color="inherit" onClick={retry} size="small">
          Thử lại
        </Button>
      }
      severity="error"
    >
      {message}
    </Alert>
  );
}
