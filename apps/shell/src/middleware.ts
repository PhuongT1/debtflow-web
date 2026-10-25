import { NextResponse, type NextRequest } from 'next/server';

/** Capture the requested page for the server-side layout's login redirect. */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-debtflow-return-to', `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api(?:/|$)|_next(?:/|$)|login(?:/|$)|favicon\\.ico$).*)'],
};
