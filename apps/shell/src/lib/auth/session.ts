import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { UserRole } from '@/lib/domain/enums';
import { authService } from '@/services/auth';

import { getRequestedLoginUrl } from './login-navigation';
import { mapAuthUser, refreshAccessToken, TOKEN_REFRESH_BUFFER_MS } from './tokens';

export const authConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? '');
        if (!email || !password) return null;
        const result = await authService.login({ email, password });
        if (!result?.user || !result.accessToken) return null;
        return mapAuthUser({ result });
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.organization = user.organization;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.refreshToken = user.refreshToken;
        token.error = undefined;
      }
      if (
        typeof token.accessTokenExpiresAt === 'number' &&
        Date.now() < token.accessTokenExpiresAt - TOKEN_REFRESH_BUFFER_MS
      )
        return token;
      return refreshAccessToken({ token });
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? '';
        session.user.role = token.role ?? UserRole.VIEWER;
        session.user.organization = token.organization;
      }
      session.accessToken = typeof token.accessToken === 'string' ? token.accessToken : undefined;
      session.error = token.error === 'RefreshTokenError' ? 'RefreshTokenError' : undefined;
      return session;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

export function getUsableSession(session: Session | null) {
  if (!session?.user?.id || !session.accessToken || session.error === 'RefreshTokenError') {
    return null;
  }
  return { user: session.user, accessToken: session.accessToken };
}

// React caches only within the current server render. Layout and page use the same refresh result.
const getPageSession = cache(async () => getUsableSession(await auth()));

export async function requirePageSession() {
  const session = await getPageSession();
  if (!session) redirect(await getRequestedLoginUrl());
  return session;
}
