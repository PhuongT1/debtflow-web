import { NextResponse } from 'next/server';
import type { NextAuthRequest } from 'next-auth';
import { getTranslations } from 'next-intl/server';

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@packages/platform-contracts';

import { http } from '@/lib/api/http';
import { auth, getUsableSession } from '@/lib/auth/session';
import { API_URL } from '@/lib/config/environment';

import type { ProxyRequestContextOptions } from './route.types';

const HOP_BY_HOP_HEADERS = new Set([
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'transfer-encoding',
]);

function buildBackendUrl(path: string[], search: string) {
  const baseUrl = API_URL.endsWith('/') ? API_URL : `${API_URL}/`;
  const url = new URL(path.map(encodeURIComponent).join('/'), baseUrl);
  url.search = search;

  return url;
}

async function proxyRequest(request: NextAuthRequest, context: ProxyRequestContextOptions) {
  const ui = await getTranslations('Workspace');

  const session = getUsableSession(request.auth);

  if (!session) {
    return NextResponse.json(
      { message: ui('yourSessionHasExpiredPleaseSignInAgain') },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const { path } = await context.params;
  const headers = new Headers(request.headers);

  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));
  headers.set('Authorization', `Bearer ${session.accessToken}`);

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && !headers.has('Accept-Language')) {
    headers.set('Accept-Language', cookieLocale);
  } else if (!headers.has('Accept-Language')) {
    headers.set('Accept-Language', DEFAULT_LOCALE);
  }

  try {
    const response = await http.request(buildBackendUrl(path, request.nextUrl.search), {
      body:
        request.method === 'GET' || request.method === 'HEAD'
          ? undefined
          : await request.arrayBuffer(),
      cache: 'no-store',
      headers,
      method: request.method,
    });
    const responseHeaders = new Headers(response.headers);

    HOP_BY_HOP_HEADERS.forEach((header) => responseHeaders.delete(header));
    responseHeaders.set('Cache-Control', 'no-store');

    return new NextResponse(response.body, {
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
    });
  } catch {
    return NextResponse.json(
      {
        message: ui('unableToConnectToTheBackendApiPleaseCheck'),
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

const handler = auth(proxyRequest);

export { handler as GET, handler as POST, handler as PATCH, handler as PUT, handler as DELETE };
