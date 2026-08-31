export type AppLocale = "vi" | "en";
export const DEFAULT_LOCALE: AppLocale = "vi";
export const SUPPORTED_LOCALES: readonly AppLocale[] = ["vi", "en"] as const;
export const LOCALE_COOKIE_NAME = "df_locale";

export function getStoredLocale(): AppLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=([^;]*)`));
  const val = match ? decodeURIComponent(match[1]) : null;
  if (val && (SUPPORTED_LOCALES as readonly string[]).includes(val)) {
    return val as AppLocale;
  }
  return DEFAULT_LOCALE;
}
