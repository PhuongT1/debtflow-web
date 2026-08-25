import NextAuth, { type NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { UserRole } from "@/lib/domain";
import { API_URL } from "@/lib/env";
import { unwrapApiResponse } from "@/lib/api-response";

const TOKEN_REFRESH_BUFFER_MS = 60_000;

type BackendAuthResponse = {
  accessToken: string;
  accessTokenExpiresAt?: number;
  expiresIn?: number;
  refreshToken?: string;
  tokenType: "Bearer";
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};

function getAccessTokenExpiresAt(result: BackendAuthResponse) {
  if (typeof result.accessTokenExpiresAt === "number") {
    return result.accessTokenExpiresAt;
  }

  if (typeof result.expiresIn === "number") {
    return Date.now() + result.expiresIn * 1000;
  }

  return Date.now() + 15 * 60 * 1000;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  if (!token.refreshToken) {
    return { ...token, error: "RefreshTokenError" as const };
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: token.refreshToken }),
    });
    const result = unwrapApiResponse<BackendAuthResponse>(await response.json());

    if (!response.ok || !result.accessToken) {
      return { ...token, error: "RefreshTokenError" as const };
    }

    return {
      ...token,
      accessToken: result.accessToken,
      accessTokenExpiresAt: getAccessTokenExpiresAt(result),
      refreshToken: result.refreshToken ?? token.refreshToken,
      role: result.user?.role ?? token.role,
      error: undefined,
    };
  } catch {
    return { ...token, error: "RefreshTokenError" as const };
  }
}

export const authConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) return null;

        const result = unwrapApiResponse<BackendAuthResponse>(await response.json());
        const user = result.user;
        if (!user || !result.accessToken) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accessToken: result.accessToken,
          accessTokenExpiresAt: getAccessTokenExpiresAt(result),
          refreshToken: result.refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: UserRole }).role;
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.accessTokenExpiresAt = (user as { accessTokenExpiresAt?: number }).accessTokenExpiresAt;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;
        token.error = undefined;
      }

      if (typeof token.accessTokenExpiresAt === "number" && Date.now() < token.accessTokenExpiresAt - TOKEN_REFRESH_BUFFER_MS) {
        return token;
      }

      return refreshAccessToken(token);
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as UserRole | undefined) ?? UserRole.VIEWER;
      }
      session.accessToken = typeof token.accessToken === "string" ? token.accessToken : undefined;
      session.error = token.error === "RefreshTokenError" ? "RefreshTokenError" : undefined;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export async function getServerAccessToken() {
  const session = await auth();

  if (!session?.accessToken || session.error === "RefreshTokenError") {
    return null;
  }

  return session.accessToken;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}
