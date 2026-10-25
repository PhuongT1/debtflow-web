import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { AuthenticatedShell } from '@/features/auth';
import { type AppLocale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@debtflow/contracts';
import { auth } from '@/lib/auth/session';
import { getRequestedLoginUrl } from '@/lib/auth/login-navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  if (!session?.user || session.error === 'RefreshTokenError') {
    redirect(await getRequestedLoginUrl());
  }

  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale: AppLocale =
    rawLocale === 'en' || rawLocale === 'vi' ? rawLocale : DEFAULT_LOCALE;

  return (
    <AuthenticatedShell
      currentZone="shell"
      initialLocale={initialLocale}
      initialSidebarCollapsed={cookieStore.get('debt-flow-sidebar-collapsed')?.value === 'true'}
      identity={{
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        organization: session.user.organization,
      }}
    >
      {children}
    </AuthenticatedShell>
  );
}
