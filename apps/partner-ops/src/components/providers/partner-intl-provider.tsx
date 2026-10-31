'use client';

import { useEffect, useState } from 'react';
import en from '@messages/en.json';
import vi from '@messages/vi.json';
import { NextIntlClientProvider } from 'next-intl';

import type { AppLocale } from '@packages/platform-contracts';
import { getStoredLocale, subscribePlatformEvent } from '@packages/platform-sdk';
import { AppProviders } from '@packages/ui-react';

import type { PartnerIntlProviderProps } from './partner-intl-provider.types';

const messages = { en, vi } as const;

export function PartnerIntlProvider({ children, initialLocale }: PartnerIntlProviderProps) {
  const [locale, setLocale] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    setLocale(getStoredLocale());
    return subscribePlatformEvent('locale:changed', ({ locale: nextLocale }) =>
      setLocale(nextLocale),
    );
  }, []);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="Asia/Ho_Chi_Minh">
      <AppProviders locale={locale}>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
