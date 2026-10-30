import 'server-only';

import { http } from '@/lib/api/http';
import { unwrapApiResponse } from '@/lib/api/response';
import { API_URL } from '@/lib/config/environment';

import type {
  AuthRequestOptions,
  AuthResponse,
  LoginCredentials,
  RefreshTokenRequest,
} from './auth.types';

async function requestAuth({ path, body }: AuthRequestOptions): Promise<AuthResponse | null> {
  const response = await http.post(`${API_URL}/auth/${path}`, JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) return null;
  return unwrapApiResponse<AuthResponse>(await response.json());
}

/** Backend transport stays server-side; NextAuth owns browser credentials and CSRF. */
export const authService = {
  login: (body: LoginCredentials) => requestAuth({ path: 'login', body }),
  refresh: (body: RefreshTokenRequest) => requestAuth({ path: 'refresh', body }),
};
