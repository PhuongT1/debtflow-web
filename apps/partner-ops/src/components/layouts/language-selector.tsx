'use client';

import { AppLocaleMenu } from '@packages/ui-react';

import type { LanguageSelectorProps } from './language-selector.types';

export function LanguageSelector({ locale, onChange }: LanguageSelectorProps) {
  return <AppLocaleMenu locale={locale} onLocaleChange={onChange} />;
}
