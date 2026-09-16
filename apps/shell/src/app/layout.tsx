import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import type { AppLocale } from '@debtflow/contracts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppProviders } from '@debtflow/react-ui';
import { ShellIntlProvider } from '@/i18n/shell-intl-provider';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#3972f6',
};

export const metadata: Metadata = {
  title: 'Sales Debt Management',
  description: 'Quản lý công nợ phải thu và phải trả',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await getLocale()) as AppLocale;

  return (
    <html lang={locale}>
      <body>
        <AppRouterCacheProvider>
          <ShellIntlProvider initialLocale={locale}>
            <AppProviders>{children}</AppProviders>
          </ShellIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
