import './globals.css';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Metadata, Viewport } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';

import type { AppLocale } from '@packages/platform-contracts';
import { themeSchemes } from '@packages/ui-tokens';

import { ShellIntlProvider } from '@/i18n/shell-intl-provider';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: themeSchemes.light.color.primary },
    { media: '(prefers-color-scheme: dark)', color: themeSchemes.dark.color.background },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const ui = await getTranslations('Workspace');

  return {
    title: 'Sales Debt Management',
    description: ui('manageAccountsReceivableAndAccountsPayable'),
    icons: { icon: '/icon.svg', shortcut: '/icon.svg' },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await getLocale()) as AppLocale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="class" defaultMode="system" />
        <AppRouterCacheProvider>
          <ShellIntlProvider initialLocale={locale}>{children}</ShellIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
