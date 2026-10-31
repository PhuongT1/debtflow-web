'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { enUS, viVN } from '@mui/x-date-pickers/locales';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import type { AppProvidersProps } from './app-providers.types';
import { appTheme } from './app-theme';
import { getProviderQueryClient } from './query-client';
import { ToastProvider } from './toast-provider';

export function AppProviders({ children, locale = 'vi' }: AppProvidersProps) {
  const queryClient = getProviderQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ThemeProvider theme={appTheme} defaultMode="system" disableTransitionOnChange>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={locale}
          localeText={
            (locale === 'vi' ? viVN : enUS).components.MuiLocalizationProvider.defaultProps
              .localeText
          }
        >
          <CssBaseline />
          <ToastProvider>{children}</ToastProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
