import type { ApiClientErrorOptions } from './api-error.types';
export type ApiFieldError = {
  field: string;
  message: string;
  code?: string;
};

export class ApiClientError extends Error {
  fieldErrors: ApiFieldError[];
  status: number;
  messageKey?: 'sessionExpired' | 'requestFailed' | 'networkError' | 'timeout';

  constructor(message: string, options: ApiClientErrorOptions) {
    super(message);
    this.name = 'ApiClientError';
    this.fieldErrors = options.fieldErrors ?? [];
    this.status = options.status;
    this.messageKey = options.messageKey;
  }
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? (value as UnknownRecord) : null;
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

function responseMessage(body: unknown) {
  const record = asRecord(body);
  const nestedError = asRecord(record?.error);
  const firstFieldError = getErrorDetails(body).find((error) => typeof error.message === 'string');

  return typeof record?.message === 'string'
    ? record.message
    : typeof nestedError?.message === 'string'
      ? nestedError.message
      : typeof firstFieldError?.message === 'string'
        ? firstFieldError.message
        : '';
}

function getApiFieldErrors(body: unknown): ApiFieldError[] {
  return getErrorDetails(body)
    .filter(
      (error): error is UnknownRecord & { field: string; message: string } =>
        typeof error.field === 'string' && typeof error.message === 'string',
    )
    .map((error) => ({
      field: error.field,
      message: error.message,
      code: typeof error.code === 'string' ? error.code : undefined,
    }));
}

export function normalizeApiError(body: unknown, status: number, timeout = false) {
  const message = responseMessage(body);
  return new ApiClientError(message || 'Request failed', {
    status,
    fieldErrors: getApiFieldErrors(body),
    messageKey:
      status === 401
        ? 'sessionExpired'
        : timeout
          ? 'timeout'
          : status === 0
            ? 'networkError'
            : !message
              ? 'requestFailed'
              : undefined,
  });
}

export function getApiErrorMessage(
  error: unknown,
  translate: (key: NonNullable<ApiClientError['messageKey']>) => string,
) {
  if (error instanceof ApiClientError && error.messageKey) return translate(error.messageKey);
  return error instanceof Error ? error.message : translate('requestFailed');
}
