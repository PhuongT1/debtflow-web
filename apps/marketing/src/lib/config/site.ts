import 'server-only';

function readOrigin(value: string | undefined) {
  if (!value?.trim()) return undefined;

  const url = new URL(value);
  if (
    !['https:', 'http:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('Marketing site configuration must use an HTTP(S) origin.');
  }

  return url.origin;
}

export const siteName = 'DebtFlow';
export const siteUrl = readOrigin(process.env.MARKETING_SITE_URL);
const shellUrl = readOrigin(
  process.env.MARKETING_SHELL_URL ??
    (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined),
);

export const loginUrl = shellUrl && new URL('/login', shellUrl).href;
export const canIndex = Boolean(
  siteUrl && (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'),
);
