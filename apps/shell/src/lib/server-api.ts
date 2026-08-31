import { cookies } from "next/headers";
import { API_URL } from "@/lib/env";
import { getServerAccessToken } from "@/lib/auth";
import { unwrapApiResponse } from "@/lib/api-response";
import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from "@debtflow/contracts";

export class Money {
  private readonly amount: number;

  constructor(value: unknown) {
    this.amount = Number(value ?? 0);
  }

  minus(value: unknown) {
    return new Money(this.amount - Number(value instanceof Money ? value.valueOf() : value ?? 0));
  }

  plus(value: unknown) {
    return new Money(this.amount + Number(value instanceof Money ? value.valueOf() : value ?? 0));
  }

  greaterThan(value: unknown) {
    return this.amount > Number(value instanceof Money ? value.valueOf() : value ?? 0);
  }

  greaterThanOrEqualTo(value: unknown) {
    return this.amount >= Number(value instanceof Money ? value.valueOf() : value ?? 0);
  }

  lessThan(value: unknown) {
    return this.amount < Number(value instanceof Money ? value.valueOf() : value ?? 0);
  }

  lessThanOrEqualTo(value: unknown) {
    return this.amount <= Number(value instanceof Money ? value.valueOf() : value ?? 0);
  }

  toString() {
    return String(this.amount);
  }

  valueOf() {
    return this.amount;
  }
}

type ApiOptions = {
  query?: Record<string, string | number | boolean | undefined>;
};

export async function apiGet<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = new URL(path.replace(/^\/+/, ""), API_URL.endsWith("/") ? API_URL : `${API_URL}/`);
  const [accessToken, cookieStore] = await Promise.all([getServerAccessToken(), cookies()]);
  const headers = new Headers();

  if (!accessToken) {
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value || DEFAULT_LOCALE;
  headers.set("Authorization", `Bearer ${accessToken}`);
  headers.set("Accept-Language", locale);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", headers });
  } catch (error: unknown) {
    const err = error as { code?: string; cause?: { code?: string }; message?: string } | null;
    const isConnRefused =
      err?.cause?.code === "ECONNREFUSED" ||
      err?.code === "ECONNREFUSED" ||
      err?.cause?.code === "ENOTFOUND" ||
      err?.message?.includes("fetch failed");

    if (isConnRefused) {
      throw new Error(
        `Unable to connect to Backend API (${API_URL}). Please ensure the Backend service (debtflow-api) is running.`,
      );
    }
    throw error;
  }

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? body?.error?.message ?? "Không thể tải dữ liệu từ API backend");
  }

  return unwrapApiResponse<T>(body);
}

export function toDate(value: unknown) {
  return value ? new Date(String(value)) : null;
}

export function toMoney(value: unknown) {
  return new Money(value);
}
