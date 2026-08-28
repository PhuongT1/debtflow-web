import { API_URL } from "@/lib/env";
import { getServerAccessToken } from "@/lib/auth";
import { unwrapApiResponse } from "@/lib/api-response";

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
  const accessToken = await getServerAccessToken();
  const headers = new Headers();

  if (!accessToken) {
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  headers.set("Authorization", `Bearer ${accessToken}`);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, { cache: "no-store", headers });
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
