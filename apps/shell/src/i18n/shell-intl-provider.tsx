'use client';

import { useEffect, useState } from 'react';
import type { AppLocale } from '@debtflow/contracts';
import { getStoredLocale, subscribePlatformEvent } from '@debtflow/platform-sdk';
import { NextIntlClientProvider } from 'next-intl';
import en from '../../messages/en.json';
import vi from '../../messages/vi.json';

const messages = { en, vi } as const;

export function ShellIntlProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: AppLocale;
}) {
  const [locale, setLocale] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    setLocale(getStoredLocale());
    return subscribePlatformEvent('locale:changed', ({ locale: nextLocale }) => setLocale(nextLocale));
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Asia/Ho_Chi_Minh">
      {children}
    </NextIntlClientProvider>
  );
}
