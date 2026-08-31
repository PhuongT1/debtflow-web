import { NextRequest, NextResponse } from "next/server";
import { getServerAccessToken } from "@/lib/auth";
import { API_URL } from "@/lib/env";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "@debtflow/contracts";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "host",
  "keep-alive",
  "transfer-encoding",
]);

function buildBackendUrl(path: string[], search: string) {
  const baseUrl = API_URL.endsWith("/") ? API_URL : `${API_URL}/`;
  const url = new URL(path.map(encodeURIComponent).join("/"), baseUrl);
  url.search = search;

  return url;
}

async function proxyRequest(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return NextResponse.json({ message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });
  }

  const { path } = await context.params;
  const headers = new Headers(request.headers);

  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));
  headers.set("Authorization", `Bearer ${accessToken}`);

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (cookieLocale && !headers.has("Accept-Language")) {
    headers.set("Accept-Language", cookieLocale);
  } else if (!headers.has("Accept-Language")) {
    headers.set("Accept-Language", DEFAULT_LOCALE);
  }

  try {
    const response = await fetch(buildBackendUrl(path, request.nextUrl.search), {
      body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
      cache: "no-store",
      headers,
      method: request.method,
    });
    const responseHeaders = new Headers(response.headers);

    HOP_BY_HOP_HEADERS.forEach((header) => responseHeaders.delete(header));

    return new NextResponse(response.body, {
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
    });
  } catch {
    return NextResponse.json(
      { message: "Không thể kết nối đến máy chủ Backend API. Vui lòng kiểm tra lại dịch vụ Backend." },
      { status: 503 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
