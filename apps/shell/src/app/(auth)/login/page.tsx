import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/session';
import { resolveLoginReturnTo } from '@/lib/auth/login-navigation';
import { LoginForm } from '@/features/auth';

export const dynamic = 'force-dynamic';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string; returnTo?: string }>;
}) {
  const [params, session] = await Promise.all([searchParams, auth()]);
  const returnTo = resolveLoginReturnTo(params.callbackUrl ?? params.returnTo);

  if (session?.user && session.accessToken && session.error !== 'RefreshTokenError') {
    redirect(returnTo);
  }

  return <LoginForm initialError={params.error ?? null} returnTo={returnTo} />;
}
