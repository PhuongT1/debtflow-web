import { redirect } from 'next/navigation';

import { LoginForm } from '@/features/auth';
import { resolveLoginReturnTo } from '@/lib/auth/login-navigation';
import { auth } from '@/lib/auth/session';

import type { LoginPageProps } from './page.types';

export const dynamic = 'force-dynamic';

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const [params, session] = await Promise.all([searchParams, auth()]);
  const returnTo = resolveLoginReturnTo({ value: params.callbackUrl ?? params.returnTo });

  if (session?.user && session.accessToken && session.error !== 'RefreshTokenError') {
    redirect(returnTo);
  }

  return <LoginForm initialError={params.error ?? null} returnTo={returnTo} />;
}
