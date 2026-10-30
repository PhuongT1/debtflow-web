import type { JWT } from 'next-auth/jwt';

import type { AuthResponse } from '@/services/auth/auth.types';

export interface AuthTokenExpiryOptions extends Pick<
  AuthResponse,
  'accessTokenExpiresAt' | 'expiresIn'
> {
  now?: number;
}
export interface RefreshAccessTokenOptions {
  token: JWT;
}
export interface MapAuthUserOptions {
  result: AuthResponse;
}
export type LoginResult =
  { success: true } | { success: false; error: 'CredentialsSignin' | 'Configuration' };
export interface LoginReturnToOptions {
  value?: string;
}
