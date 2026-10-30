'use client';

import { Box } from '@mui/material';
import { useLocale } from 'next-intl';
import type { ReactNode } from 'react';

import { setStoredLocale } from '@packages/platform-sdk';
import { AppLocaleMenu } from '@packages/ui-react';

/** Shared frame for login and public pages, including the global language selector. */
export function PublicPageLayout({ children }: { children: ReactNode }) {
  const locale = useLocale() === 'en' ? 'en' : 'vi';

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100dvh',
      }}
    >
      <Box
        component="header"
        sx={{ display: 'flex', justifyContent: 'flex-end', px: { xs: 2, sm: 3 }, py: 2 }}
      >
        <AppLocaleMenu locale={locale} onLocaleChange={setStoredLocale} />
      </Box>
      <Box component="main" sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
}
