import { NextResponse, type NextRequest } from 'next/server';
import { buildLoginUrl } from '@packages/platform-sdk';
import { partnerOpsEnv } from '@/lib/env';

const EMBED_PATH = '/__embed/parties';

/**
 * Records the requested Partner route before central login. For Platform
 * composition it also maps the private content entry to the business route.
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.replace(/\/+$/, '') === '/login') {
    const returnTo = new URL('/parties', request.url).toString();
    return NextResponse.redirect(buildLoginUrl(partnerOpsEnv.PLATFORM_ORIGIN, returnTo));
  }

  const requestHeaders = new Headers(request.headers);
  const applicationUrl = request.nextUrl.clone();

  if (
    request.nextUrl.pathname === '/__embed/overlays' ||
    request.nextUrl.pathname.startsWith('/__embed/overlays/')
  ) {
    requestHeaders.set('x-debtflow-embed', '1');
    requestHeaders.set('x-debtflow-overlay', '1');
    applicationUrl.pathname = request.nextUrl.pathname.replace('/__embed/overlays', '/overlays');
    requestHeaders.set('x-debtflow-return-to', '/parties');
    return NextResponse.rewrite(applicationUrl, { request: { headers: requestHeaders } });
  }

  if (request.nextUrl.pathname.startsWith(EMBED_PATH)) {
    requestHeaders.set('x-debtflow-embed', '1');
    const suffix = request.nextUrl.pathname.slice(EMBED_PATH.length);
    applicationUrl.pathname = '/parties' + suffix;

    for (const key of applicationUrl.searchParams.keys()) {
      if (key.startsWith('__df_')) applicationUrl.searchParams.delete(key);
    }

    requestHeaders.set('x-debtflow-return-to', applicationUrl.toString());

    return NextResponse.rewrite(applicationUrl, {
      request: { headers: requestHeaders },
    });
  }

  requestHeaders.set('x-debtflow-return-to', request.nextUrl.toString());

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/login',
    '/parties/:path*',
    '/__embed/parties/:path*',
    '/__embed/overlays/:path*',
    '/overlays/:path*',
  ],
};
