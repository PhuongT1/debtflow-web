'use client';

import type { AppLocale } from '@packages/platform-contracts';
import { AppLocaleMenu } from '@packages/ui-react';

export function LanguageSelector({
  locale,
  onChange,
}: {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
}) {
  return <AppLocaleMenu locale={locale} onLocaleChange={onChange} />;
}
