import type { AppLocale } from '@packages/platform-contracts';

export type LanguageSelectorProps = {
  locale: AppLocale;
  onChange: (locale: AppLocale) => void;
};
