'use client';

import type { AppLocale } from '@debtflow/contracts';
import { getStoredLocale } from '@debtflow/platform-sdk';
import { getLocalizedApiErrorMessage } from '@/lib/api/error-message';
import { http } from '@/lib/api/http';
import { unwrapApiResponse } from '@/lib/api/response';

export const DEFAULT_CLIENT_TIMEOUT_MS = 20_000;

export type ApiFieldError = { field: string; message: string; code?: string };
export type ApiRequestOptions = RequestInit & { timeoutMs?: number };
export type ApiMethodOptions = Omit<ApiRequestOptions, 'body' | 'method'>;

export class ApiClientError extends Error {
  fieldErrors: ApiFieldError[];
  status: number;

  constructor(message: string, options: { fieldErrors?: ApiFieldError[]; status: number }) {
    super(message);
    this.name = 'ApiClientError';
    this.fieldErrors = options.fieldErrors ?? [];
    this.status = options.status;
  }
}

type UnknownRecord = Record<string, unknown>;

function readApiResponseObject(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? (value as UnknownRecord) : null;
}

function extractApiErrorDetails(body: unknown): UnknownRecord[] {
  const record = readApiResponseObject(body);
  const nestedError = readApiResponseObject(record?.error);
  const errors = Array.isArray(record?.errors)
    ? record.errors
    : Array.isArray(nestedError?.details)
      ? nestedError.details
      : [];
  return errors.map(readApiResponseObject).filter((error): error is UnknownRecord => error !== null);
}

function extractLocalizedBackendErrorMessage(body: unknown, locale: AppLocale) {
  const record = readApiResponseObject(body);
  const nestedError = readApiResponseObject(record?.error);
  const firstFieldError = extractApiErrorDetails(body).find((error) => typeof error.message === 'string');
  return typeof record?.message === 'string'
    ? record.message
    : typeof nestedError?.message === 'string'
      ? nestedError.message
      : typeof firstFieldError?.message === 'string'
        ? firstFieldError.message
        : getLocalizedApiErrorMessage(locale, 'requestFailed');
}

function extractApiFieldErrors(body: unknown): ApiFieldError[] {
  return extractApiErrorDetails(body)
    .filter((error): error is UnknownRecord & { field: string; message: string } =>
      typeof error.field === 'string' && typeof error.message === 'string')
    .map((error) => ({
      field: error.field,
      message: error.message,
      code: typeof error.code === 'string' ? error.code : undefined,
    }));
}

function createRequestTimeoutSignal(signal: AbortSignal | null | undefined, timeoutMs: number) {
  if (timeoutMs <= 0) return signal ?? undefined;
  const timeout = AbortSignal.timeout(timeoutMs);
  return signal ? AbortSignal.any([signal, timeout]) : timeout;
}

function isMultipartFormData(value: unknown): value is FormData {
  return value instanceof FormData;
}

function serializeClientRequestBody(data: unknown): BodyInit | undefined {
  if (data === undefined) return undefined;
  if (
    typeof data === 'string' ||
    data instanceof Blob ||
    data instanceof URLSearchParams ||
    data instanceof ArrayBuffer ||
    ArrayBuffer.isView(data) ||
    isMultipartFormData(data)
  ) return data as BodyInit;
  return JSON.stringify(data);
}

function sendClientApiRequest(url: string, init: RequestInit): Promise<Response> {
  const { body, method = 'GET', ...options } = init;
  switch (method.toUpperCase()) {
    case 'GET': return http.get(url, options);
    case 'POST': return http.post(url, body, options);
    case 'PATCH': return http.patch(url, body, options);
    case 'PUT': return http.put(url, body, options);
    case 'DELETE': return http.delete(url, options);
    default: return http.request(url, init);
  }
}

/**
 * Private pipeline shared by all client requests: locale, timeout,
 * cancellation, response-envelope parsing and normalized errors.
 */
async function executeClientApiRequest<T>(url: string, options: ApiRequestOptions = {}): Promise<T> {
  const { timeoutMs = DEFAULT_CLIENT_TIMEOUT_MS, signal, ...init } = options;
  const locale = getStoredLocale();
  const headers = isMultipartFormData(init.body)
    ? new Headers(init.headers)
    : new Headers({ 'Content-Type': 'application/json', ...init.headers });
  if (!headers.has('Accept-Language')) headers.set('Accept-Language', locale);

  let response: Response;
  try {
    response = await sendClientApiRequest(url, {
      ...init,
      credentials: init.credentials ?? 'same-origin',
      headers,
      signal: createRequestTimeoutSignal(signal, timeoutMs),
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error;
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiClientError(getLocalizedApiErrorMessage(locale, 'requestTimedOut'), { fieldErrors: [], status: 408 });
    }
    throw new ApiClientError(getLocalizedApiErrorMessage(locale, 'connectionFailed'), { fieldErrors: [], status: 0 });
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) {
      throw new ApiClientError(getLocalizedApiErrorMessage(locale, 'authenticationExpired'), { fieldErrors: [], status: 401 });
    }
    throw new ApiClientError(extractLocalizedBackendErrorMessage(body, locale), {
      fieldErrors: extractApiFieldErrors(body),
      status: response.status,
    });
  }
  return unwrapApiResponse<T>(body);
}

/**
 * Public facade for feature services. Usage mirrors Axios while native fetch
 * remains centralized in lib/api/http.ts.
 */
export const apiClient = {
  get<T>(url: string, options: ApiMethodOptions = {}) {
    return executeClientApiRequest<T>(url, { ...options, method: 'GET' });
  },
  post<T>(url: string, data?: unknown, options: ApiMethodOptions = {}) {
    return executeClientApiRequest<T>(url, { ...options, body: serializeClientRequestBody(data), method: 'POST' });
  },
  patch<T>(url: string, data?: unknown, options: ApiMethodOptions = {}) {
    return executeClientApiRequest<T>(url, { ...options, body: serializeClientRequestBody(data), method: 'PATCH' });
  },
  put<T>(url: string, data?: unknown, options: ApiMethodOptions = {}) {
    return executeClientApiRequest<T>(url, { ...options, body: serializeClientRequestBody(data), method: 'PUT' });
  },
  delete<T>(url: string, options: ApiMethodOptions = {}) {
    return executeClientApiRequest<T>(url, { ...options, method: 'DELETE' });
  },
};
