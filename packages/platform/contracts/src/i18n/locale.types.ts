export type AppLocale = 'vi' | 'en';
export const DEFAULT_LOCALE: AppLocale = 'vi';
export const SUPPORTED_LOCALES: readonly AppLocale[] = ['vi', 'en'] as const;
export const LOCALE_COOKIE_NAME = 'df_locale';
