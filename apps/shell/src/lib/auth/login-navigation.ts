import { headers } from 'next/headers';
import { buildLoginUrl } from '@packages/platform-sdk';
import { shellEnv } from '@/lib/config/environment';

/** Only application pages on explicitly trusted origins can be login targets. */
export function resolveLoginReturnTo(value: string | undefined): string {
  if (!value || value.startsWith('//')) return '/';

  try {
    const platformOrigin = new URL(shellEnv.AUTH_URL).origin;
    const target = new URL(value, platformOrigin);
    const allowedOrigins = shellEnv.AUTH_ALLOWED_RETURN_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const pathname = decodeURIComponent(target.pathname).replace(/\/+$/, '') || '/';

    if (
      !['http:', 'https:'].includes(target.protocol) ||
      target.username ||
      target.password ||
      (target.origin !== platformOrigin && !allowedOrigins.includes(target.origin)) ||
      /^\/+(login|api|_next)(\/|$)/i.test(pathname)
    ) {
      return '/';
    }

    return target.origin === platformOrigin
      ? `${target.pathname}${target.search}${target.hash}`
      : target.toString();
  } catch {
    return '/';
  }
}

export async function getRequestedLoginUrl(): Promise<string> {
  const requestHeaders = await headers();
  const returnTo = resolveLoginReturnTo(requestHeaders.get('x-debtflow-return-to') ?? undefined);
  return buildLoginUrl(shellEnv.AUTH_URL, returnTo);
}
