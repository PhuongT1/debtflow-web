import '@packages/ui-tokens/tokens.css';
import './globals.css';

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { siteName, siteUrl } from '@/lib/config/site';

export const metadata: Metadata = {
  title: { default: siteName, template: `%s | ${siteName}` },
  icons: { icon: '/images/shared/brand/debtflow-mark.svg' },
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi" data-theme="light">
      <body>
        <a className="skip-link" href="#noi-dung">
          Đến nội dung chính
        </a>
        <SiteHeader />
        <main id="noi-dung" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
