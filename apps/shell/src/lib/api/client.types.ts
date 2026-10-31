import type { ApiFieldError } from './client';

export type ApiClientErrorOptions = { fieldErrors?: ApiFieldError[]; status: number };
