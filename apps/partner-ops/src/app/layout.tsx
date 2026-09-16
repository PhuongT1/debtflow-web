import type { Metadata, Viewport } from 'next';
import { getLocale } from 'next-intl/server';
import type { AppLocale } from '@debtflow/contracts';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AppProviders } from '@debtflow/react-ui';
import { PartnerIntlProvider } from '@/components/providers/partner-intl-provider';
import { partnerOpsEnv } from '@/lib/env';
import '@/app/globals.css';

export const viewport: Viewport = {
  themeColor: '#3972f6',
};

export const metadata: Metadata = {
  title: 'Customer Operations | Debt Flow',
  description: 'Customer and supplier operations micro frontend',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg' },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await getLocale()) as AppLocale;

  return (
    <html lang={locale}>
      <body data-platform-origin={partnerOpsEnv.PLATFORM_ORIGIN}>
        <AppRouterCacheProvider>
          <PartnerIntlProvider initialLocale={locale}>
            <AppProviders>{children}</AppProviders>
          </PartnerIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
