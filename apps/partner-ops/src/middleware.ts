import { NextResponse, type NextRequest } from "next/server";

const EMBED_PATH = "/__embed/parties";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith(EMBED_PATH)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-debtflow-embed", "1");

  const applicationUrl = request.nextUrl.clone();
  const suffix = request.nextUrl.pathname.slice(EMBED_PATH.length);
  applicationUrl.pathname = "/parties" + suffix;
  for (const key of applicationUrl.searchParams.keys()) {
    if (key.startsWith("__df_")) applicationUrl.searchParams.delete(key);
  }

  return NextResponse.rewrite(applicationUrl, {
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/__embed/parties/:path*"],
};
