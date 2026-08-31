"use client";

import { unwrapApiResponse } from "@/lib/api-response";

export type ApiFieldError = {
  field: string;
  message: string;
  code?: string;
};

import { getStoredLocale } from "@debtflow/platform-sdk";

export class ApiClientError extends Error {
  fieldErrors: ApiFieldError[];
  status: number;

  constructor(message: string, options: { fieldErrors?: ApiFieldError[]; status: number }) {
    super(message);
    this.name = "ApiClientError";
    this.fieldErrors = options.fieldErrors ?? [];
    this.status = options.status;
  }
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === "object" ? (value as UnknownRecord) : null;
}

function getErrorDetails(body: unknown): UnknownRecord[] {
  const record = asRecord(body);
  const nestedError = asRecord(record?.error);
  const errors = Array.isArray(record?.errors)
    ? record.errors
    : Array.isArray(nestedError?.details)
      ? nestedError.details
      : [];

  return errors.map(asRecord).filter((error): error is UnknownRecord => error !== null);
}

function getApiErrorMessage(body: unknown) {
  const record = asRecord(body);
  const nestedError = asRecord(record?.error);
  const firstFieldError = getErrorDetails(body).find((error) => typeof error.message === "string");

  return typeof record?.message === "string"
    ? record.message
    : typeof nestedError?.message === "string"
      ? nestedError.message
      : typeof firstFieldError?.message === "string"
        ? firstFieldError.message
        : "Không thể thực hiện thao tác";
}

function getApiFieldErrors(body: unknown): ApiFieldError[] {
  return getErrorDetails(body)
    .filter(
      (error): error is UnknownRecord & { field: string; message: string } =>
        typeof error.field === "string" && typeof error.message === "string",
    )
    .map((error) => ({
      field: error.field,
      message: error.message,
      code: typeof error.code === "string" ? error.code : undefined,
    }));
}

export async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const headers =
    init?.body instanceof FormData
      ? new Headers(init.headers)
      : new Headers({ "Content-Type": "application/json", ...init?.headers });

  if (!headers.has("Accept-Language")) {
    headers.set("Accept-Language", getStoredLocale());
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiClientError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
        fieldErrors: [],
        status: response.status,
      });
    }

    throw new ApiClientError(getApiErrorMessage(body), {
      fieldErrors: getApiFieldErrors(body),
      status: response.status,
    });
  }

  return unwrapApiResponse<T>(body);
}
