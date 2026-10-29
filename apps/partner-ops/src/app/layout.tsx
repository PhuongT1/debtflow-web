import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { themeSchemes } from '@packages/ui-tokens';
import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import type { AppLocale } from '@packages/platform-contracts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppProviders } from '@packages/ui-react';
import { PartnerIntlProvider } from '@/components/providers/partner-intl-provider';
import { partnerOpsEnv } from '@/lib/env';
import '@/app/globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeSchemes.light.color.primary },
    { media: '(prefers-color-scheme: dark)', color: themeSchemes.dark.color.background },
  ],
};

export const metadata: Metadata = {
  title: 'Customer Operations | Debt Flow',
  description: 'Customer and supplier operations micro frontend',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await getLocale()) as AppLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body data-platform-origin={partnerOpsEnv.PLATFORM_ORIGIN}>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <AppRouterCacheProvider>
          <PartnerIntlProvider initialLocale={locale}>
            <AppProviders>{children}</AppProviders>
          </PartnerIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
