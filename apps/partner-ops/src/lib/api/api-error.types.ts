import type { ApiClientError, ApiFieldError } from './api-error';

export type ApiClientErrorOptions = {
  fieldErrors?: ApiFieldError[];
  status: number;
  messageKey?: ApiClientError['messageKey'];
};
