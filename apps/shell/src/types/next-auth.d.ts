import { type UserRole } from "@/lib/domain";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
    accessToken?: string;
    error?: "RefreshTokenError";
  }

  interface User {
    role?: UserRole;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
    accessTokenExpiresAt?: number;
    refreshToken?: string;
    error?: "RefreshTokenError";
  }
}
