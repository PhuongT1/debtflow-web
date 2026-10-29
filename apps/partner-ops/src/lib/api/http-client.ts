import axios, { type AxiosRequestConfig } from 'axios';
import { getStoredLocale, unwrapApiResponse } from '@packages/platform-contracts';
import { normalizeApiError, ApiClientError } from './api-error';
import { parsePaginatedResponse } from './paginated-response';

/** Browser-only transport. Use the app's same-origin proxy in standalone and embedded mode. */
export const httpClient = axios.create({
  baseURL: '/api',
  timeout: 30_000,
  withCredentials: true,
  headers: { Accept: 'application/json', 'x-frontend-zone': 'partner-ops' },
});

httpClient.interceptors.request.use((config) => {
  if (!config.headers.has('Accept-Language'))
    config.headers.set('Accept-Language', getStoredLocale());
  return config;
});
httpClient.interceptors.response.use(undefined, (error: unknown) => {
  if (axios.isCancel(error)) return Promise.reject(error);
  if (!axios.isAxiosError(error)) return Promise.reject(error);
  return Promise.reject(
    normalizeApiError(
      error.response?.data,
      error.response?.status ?? 0,
      error.code === 'ECONNABORTED',
    ),
  );
});

export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await httpClient.request<unknown>(config);
  return unwrapApiResponse<T>(response.data);
}

/** Retains meta.pagination rather than applying the legacy flat-list adapter. */
export async function apiPaginatedRequest<Item>(config: AxiosRequestConfig) {
  const response = await httpClient.request<unknown>(config);
  try {
    return parsePaginatedResponse<Item>(response.data);
  } catch {
    throw new ApiClientError('Request failed', {
      status: response.status,
      messageKey: 'requestFailed',
    });
  }
}
