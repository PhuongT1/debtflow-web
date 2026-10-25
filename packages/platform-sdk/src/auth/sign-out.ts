import { buildLoginUrl } from '../navigation/login-url';

/** Sign out through the host's same-origin Platform API proxy after UI confirmation. */
export async function signOutFromPlatform(platformOrigin: string): Promise<void> {
  const loginUrl = buildLoginUrl(platformOrigin, window.location.href);
  const csrfResponse = await fetch('/api/auth/csrf', {
    credentials: 'same-origin',
    cache: 'no-store',
  });
  if (!csrfResponse.ok) throw new Error('Unable to initialize sign out');
  const csrf: unknown = await csrfResponse.json();
  if (
    !csrf ||
    typeof csrf !== 'object' ||
    !('csrfToken' in csrf) ||
    typeof csrf.csrfToken !== 'string' ||
    !csrf.csrfToken
  )
    throw new Error('Invalid sign-out CSRF response');

  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Auth-Return-Redirect': '1',
    },
    body: new URLSearchParams({ csrfToken: csrf.csrfToken, callbackUrl: loginUrl }),
  });
  if (!response.ok) throw new Error('Unable to sign out');
  const result: unknown = await response.json();
  if (!result || typeof result !== 'object' || !('url' in result) || result.url !== loginUrl) {
    throw new Error('Sign out was not completed');
  }
  window.location.replace(loginUrl);
}
