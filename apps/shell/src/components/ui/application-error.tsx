'use client';
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { isBackendUnavailableError } from '@/lib/api/network-error';

import { AppIcon } from './app-icon';
import type { ApplicationErrorProps } from './application-error.types';

export function ApplicationError({ error, reset, fullPage = false }: ApplicationErrorProps) {
  const t = useTranslations('ApplicationError');
  const unavailable = isBackendUnavailableError(error);
  return (
    <Box
      sx={{
        minHeight: fullPage ? '100dvh' : 'calc(100dvh - 88px)',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, md: 3 },
      }}
    >
      <Card sx={{ maxWidth: 640, width: '100%', border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'grid', gap: 2.5 }}>
          <Typography
            variant="h6"
            color="error.main"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
          >
            <AppIcon name="warning" />
            {t(unavailable ? 'unavailableTitle' : 'unexpectedTitle')}
          </Typography>
          <Alert severity={unavailable ? 'warning' : 'error'}>
            {t(unavailable ? 'unavailable' : 'unexpected')}
          </Alert>
          <Typography color="text.secondary">{t('help')}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => window.location.reload()}>
              {t('reload')}
            </Button>
            <Button variant="contained" onClick={reset}>
              {t('retry')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
