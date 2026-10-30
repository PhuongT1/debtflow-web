import type { User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

import { authService } from '@/services/auth';

import type {
  AuthTokenExpiryOptions,
  MapAuthUserOptions,
  RefreshAccessTokenOptions,
} from './auth.types';

export const TOKEN_REFRESH_BUFFER_MS = 60_000;

export function getAccessTokenExpiresAt({
  accessTokenExpiresAt,
  expiresIn,
  now = Date.now(),
}: AuthTokenExpiryOptions) {
  if (typeof accessTokenExpiresAt === 'number') return accessTokenExpiresAt;
  return now + (typeof expiresIn === 'number' ? expiresIn : 15 * 60) * 1000;
}

export function mapAuthUser({ result }: MapAuthUserOptions): User {
  return {
    id: result.user.id,
    name: result.user.name,
    email: result.user.email,
    role: result.activeOrganization.role,
    organization: result.activeOrganization,
    accessToken: result.accessToken,
    accessTokenExpiresAt: getAccessTokenExpiresAt(result),
    refreshToken: result.refreshToken,
  };
}

export async function refreshAccessToken({ token }: RefreshAccessTokenOptions): Promise<JWT> {
  if (!token.refreshToken) return { ...token, error: 'RefreshTokenError' };
  try {
    const result = await authService.refresh({ refreshToken: token.refreshToken });
    if (!result?.accessToken) return { ...token, error: 'RefreshTokenError' };
    return {
      ...token,
      accessToken: result.accessToken,
      accessTokenExpiresAt: getAccessTokenExpiresAt(result),
      refreshToken: result.refreshToken ?? token.refreshToken,
      role: result.activeOrganization?.role ?? token.role,
      organization: result.activeOrganization ?? token.organization,
      error: undefined,
    };
  } catch {
    return { ...token, error: 'RefreshTokenError' };
  }
}
