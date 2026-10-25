'use client';

import type { AppLocale } from '@debtflow/contracts';
import { AppLocaleMenu } from '@debtflow/react-ui';

export function LanguageSelector({
  locale,
  onChange,
}: {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
}) {
  return <AppLocaleMenu locale={locale} onLocaleChange={onChange} />;
}
