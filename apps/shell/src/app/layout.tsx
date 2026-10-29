import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { themeSchemes } from '@packages/ui-tokens';
import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import type { AppLocale } from '@packages/platform-contracts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppProviders } from '@packages/ui-react';
import { ShellIntlProvider } from '@/i18n/shell-intl-provider';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeSchemes.light.color.primary },
    { media: '(prefers-color-scheme: dark)', color: themeSchemes.dark.color.background },
  ],
};

export const metadata: Metadata = {
  title: 'Sales Debt Management',
  description: 'Quản lý công nợ phải thu và phải trả',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await getLocale()) as AppLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <AppRouterCacheProvider>
          <ShellIntlProvider initialLocale={locale}>
            <AppProviders>{children}</AppProviders>
          </ShellIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
