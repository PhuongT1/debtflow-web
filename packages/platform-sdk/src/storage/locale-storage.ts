import {
  type AppLocale,
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  SUPPORTED_LOCALES,
} from "@debtflow/contracts";
import { publishPlatformEvent } from "../event-bus/event-bus";

export function getStoredLocale(): AppLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE_NAME}=([^;]*)`));
  const val = match ? decodeURIComponent(match[1]) : null;
  if (val && (SUPPORTED_LOCALES as readonly string[]).includes(val)) {
    return val as AppLocale;
  }
  return DEFAULT_LOCALE;
}

export function setStoredLocale(locale: AppLocale) {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  publishPlatformEvent("locale:changed", { locale });
}
