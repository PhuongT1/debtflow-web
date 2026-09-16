import { type OrganizationKind, type UserRole } from '@/lib/domain/enums';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      organization?: { id: string; name: string; slug: string; kind: OrganizationKind; role: UserRole; membershipId: string };
    };
    accessToken?: string;
    organization?: { id: string; name: string; slug: string; kind: OrganizationKind; role: UserRole; membershipId: string };
    error?: 'RefreshTokenError';
  }

  interface User {
    role?: UserRole;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
    error?: 'RefreshTokenError';
  }
}
