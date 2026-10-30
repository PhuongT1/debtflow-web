import NextAuth, { type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { UserRole } from '@/lib/domain/enums';
import { authService } from '@/services/auth';

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

export async function getServerAccessToken() {
  const session = await auth();
  if (!session?.accessToken || session.error === 'RefreshTokenError') return null;
  return session.accessToken;
}

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}
