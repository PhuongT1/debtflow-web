import type { AuthOrganization } from '@/services/auth/auth.types';
import { type UserRole } from '@/lib/domain/enums';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      organization?: AuthOrganization;
    };
    accessToken?: string;
    organization?: AuthOrganization;
    error?: 'RefreshTokenError';
  }

  interface User {
    organization?: AuthOrganization;
    role?: UserRole;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    organization?: AuthOrganization;
    role?: UserRole;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
    error?: 'RefreshTokenError';
  }
}
