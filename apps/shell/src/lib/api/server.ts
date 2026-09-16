import { cookies } from 'next/headers';
import { API_URL } from '@/lib/config/environment';
import { getServerAccessToken } from '@/lib/auth/session';
import { unwrapApiResponse } from '@/lib/api/response';
import { http } from '@/lib/api/http';
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, type AppLocale } from '@debtflow/contracts';
import { getLocalizedApiErrorMessage } from '@/lib/api/error-message';
import { isBackendUnavailableError } from '@/lib/api/network-error';

export class Money {
  private readonly amount: number;

  constructor(value: unknown) {
    this.amount = Number(value ?? 0);
  }

  minus(value: unknown) {
    return new Money(this.amount - Number(value instanceof Money ? value.valueOf() : (value ?? 0)));
  }

  plus(value: unknown) {
    return new Money(this.amount + Number(value instanceof Money ? value.valueOf() : (value ?? 0)));
  }

  greaterThan(value: unknown) {
    return this.amount > Number(value instanceof Money ? value.valueOf() : (value ?? 0));
  }

  greaterThanOrEqualTo(value: unknown) {
    return this.amount >= Number(value instanceof Money ? value.valueOf() : (value ?? 0));
  }

  lessThan(value: unknown) {
    return this.amount < Number(value instanceof Money ? value.valueOf() : (value ?? 0));
  }

  lessThanOrEqualTo(value: unknown) {
    return this.amount <= Number(value instanceof Money ? value.valueOf() : (value ?? 0));
  }

  toString() {
    return String(this.amount);
  }

  valueOf() {
    return this.amount;
  }
}

export type ServerApiGetOptions = {
  query?: Record<string, string | number | boolean | undefined>;
};

async function getServerApiResource<T>(path: string, options: ServerApiGetOptions = {}): Promise<T> {
  const url = new URL(path.replace(/^\/+/, ''), API_URL.endsWith('/') ? API_URL : `${API_URL}/`);
  const [accessToken, cookieStore] = await Promise.all([getServerAccessToken(), cookies()]);
  const headers = new Headers();

  const requestedLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const locale: AppLocale = requestedLocale === 'en' || requestedLocale === 'vi' ? requestedLocale : DEFAULT_LOCALE;

  if (!accessToken) {
    throw new Error(getLocalizedApiErrorMessage(locale, 'authenticationExpired'));
  }
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Accept-Language', locale);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  let response: Response;
  try {
    response = await http.get(url, { cache: 'no-store', headers });
  } catch (error: unknown) {
    if (isBackendUnavailableError(error)) {
      throw new Error(getLocalizedApiErrorMessage(locale, 'backendUnavailable'));
    }
    throw error;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      body?.message ?? body?.error?.message ?? getLocalizedApiErrorMessage(locale, 'requestFailed'),
    );
  }

  return unwrapApiResponse<T>(body);
}

export const apiServer = { get: getServerApiResource };

export function toDate(value: unknown) {
  return value ? new Date(String(value)) : null;
}

export function toMoney(value: unknown) {
  return new Money(value);
}
