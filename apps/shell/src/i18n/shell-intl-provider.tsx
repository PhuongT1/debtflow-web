'use client';

import { useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';

import type { AppLocale } from '@packages/platform-contracts';
import { getStoredLocale, subscribePlatformEvent } from '@packages/platform-sdk';

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
    return subscribePlatformEvent('locale:changed', ({ locale: nextLocale }) =>
      setLocale(nextLocale),
    );
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Asia/Ho_Chi_Minh">
      {children}
    </NextIntlClientProvider>
  );
}
