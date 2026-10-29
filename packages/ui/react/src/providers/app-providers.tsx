'use client';

import type { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { ToastProvider } from './toast-provider';
import { appTheme } from './app-theme';
import { getProviderQueryClient } from './query-client';

export function AppProviders({ children }: PropsWithChildren) {
  const queryClient = getProviderQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={appTheme} defaultMode="system" disableTransitionOnChange>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
          <CssBaseline />
          <ToastProvider>{children}</ToastProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
