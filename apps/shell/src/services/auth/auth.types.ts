import type { OrganizationKind, UserRole } from '@/lib/domain/enums';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthOrganization {
  id: string;
  name: string;
  slug: string;
  kind: OrganizationKind;
  role: UserRole;
  membershipId: string;
}

export interface AuthResponse {
  accessToken: string;
  accessTokenExpiresAt?: number;
  expiresIn?: number;
  refreshToken?: string;
  tokenType: 'Bearer';
  user: { id: string; name: string; email: string; systemRole: string };
  activeOrganization: AuthOrganization;
}

export interface AuthRequestOptions {
  path: 'login' | 'refresh';
  body: LoginCredentials | RefreshTokenRequest;
}
