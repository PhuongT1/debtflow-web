import en from '@messages/en.json';
import vi from '@messages/vi.json';

import type { AppLocale } from '@packages/platform-contracts';

export type ApiErrorMessageKey =
  | 'authenticationExpired'
  | 'backendUnavailable'
  | 'connectionFailed'
  | 'requestFailed'
  | 'requestTimedOut';

export function getLocalizedApiErrorMessage(locale: AppLocale, key: ApiErrorMessageKey) {
  return (locale === 'en' ? en : vi).ApiErrors[key];
}
