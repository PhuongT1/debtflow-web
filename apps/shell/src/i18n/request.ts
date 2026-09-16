import type { AppLocale } from '@debtflow/contracts';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, SUPPORTED_LOCALES } from '@debtflow/contracts';
import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

function isSupportedLocale(value: string | undefined): value is AppLocale {
  return Boolean(value && (SUPPORTED_LOCALES as readonly string[]).includes(value));
}

export default getRequestConfig(async () => {
  const store = await cookies();
  const requestedLocale = store.get(LOCALE_COOKIE_NAME)?.value;
  const locale = isSupportedLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
  const messages =
    locale === 'en'
      ? (await import('../../messages/en.json')).default
      : (await import('../../messages/vi.json')).default;

  return { locale, messages, timeZone: 'Asia/Ho_Chi_Minh' };
});
