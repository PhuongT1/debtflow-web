/** Build the central login URL without losing a caller's navigation context. */
export function buildLoginUrl(platformOrigin: string, returnTo: string): string {
  const loginUrl = new URL('/login', platformOrigin);
  loginUrl.searchParams.set('callbackUrl', returnTo);
  return loginUrl.toString();
}
