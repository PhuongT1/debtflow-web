import { NextResponse, type NextRequest } from "next/server";

const EMBED_PATH = "/__embed/parties";

/**
 * Records the requested Partner route before central login. For Platform
 * composition it also maps the private content entry to the business route.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const applicationUrl = request.nextUrl.clone();

  if (request.nextUrl.pathname.startsWith(EMBED_PATH)) {
    requestHeaders.set("x-debtflow-embed", "1");
    const suffix = request.nextUrl.pathname.slice(EMBED_PATH.length);
    applicationUrl.pathname = "/parties" + suffix;

    for (const key of applicationUrl.searchParams.keys()) {
      if (key.startsWith("__df_")) applicationUrl.searchParams.delete(key);
    }

    requestHeaders.set("x-debtflow-return-to", applicationUrl.toString());

    return NextResponse.rewrite(applicationUrl, {
      request: { headers: requestHeaders },
    });
  }

  requestHeaders.set("x-debtflow-return-to", request.nextUrl.toString());

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/parties/:path*", "/__embed/parties/:path*"],
};
