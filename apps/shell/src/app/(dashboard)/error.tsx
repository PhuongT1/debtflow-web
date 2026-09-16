'use client';

import { useEffect } from 'react';
import { Alert, Box, Button, Card, CardContent, Typography } from '@mui/material';
import { AppIcon } from '@/components/ui/app-icon';
import { isBackendUnavailableError } from '@/lib/api/network-error';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error boundary caught:', error);
  }, [error]);

  const isBackendDown = isBackendUnavailableError(error);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100dvh - 88px)',
        height: '100%',
        width: '100%',
        p: { xs: 2, md: 3 },
        boxSizing: 'border-box',
      }}
    >
      <Card
        sx={{
          maxWidth: 640,
          width: '100%',
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CardContent
          sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AppIcon name="warning" sx={{ color: 'error.main', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'error.main' }}>
              {isBackendDown
                ? 'Cannot Connect to Backend Server'
                : 'An Error Occurred While Loading Data'}
            </Typography>
          </Box>

          <Alert severity={isBackendDown ? 'warning' : 'error'} variant="outlined">
            {error.message || 'Failed to load data from the system. Please try again later.'}
          </Alert>

          {isBackendDown && (
            <Box
              sx={{
                bgcolor: 'action.hover',
                p: 2,
                borderRadius: 1.5,
                fontSize: 13,
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Troubleshooting steps / Hướng dẫn xử lý:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.6 }}>
                <li>
                  Make sure the <strong>debtflow-api</strong> backend service is running (e.g.{' '}
                  <code>npm run start:dev</code>).
                </li>
                <li>
                  Verify your <code>API_URL</code> environment variable configuration in platform{' '}
                  <code>.env</code>.
                </li>
                <li>
                  Once the backend server is active, click <strong>Try Again</strong> below.
                </li>
              </ul>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
            <Button variant="outlined" color="inherit" onClick={() => window.location.reload()}>
              Reload Page
            </Button>
            <Button variant="contained" color="primary" onClick={() => reset()}>
              Try Again
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
