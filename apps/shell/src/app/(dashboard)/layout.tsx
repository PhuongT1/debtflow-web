import { cookies } from 'next/headers';

import { type AppLocale, DEFAULT_LOCALE, LOCALE_COOKIE_NAME } from '@packages/platform-contracts';
import { getApplicationOverlayViews, microfrontendManifest } from '@packages/platform-registry';

import { AuthenticatedShell } from '@/features/auth';
import { requirePageSession } from '@/lib/auth/session';

import type { DashboardLayoutProps } from './layout.types';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const [session, cookieStore] = await Promise.all([requirePageSession(), cookies()]);

  const rawLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  const initialLocale: AppLocale =
    rawLocale === 'en' || rawLocale === 'vi' ? rawLocale : DEFAULT_LOCALE;

  const overlayViews = Object.assign(
    {},
    ...microfrontendManifest.applications
      .filter((application) => process.env[application.enabledEnv] === 'true')
      .map((application) =>
        getApplicationOverlayViews(application.name, application.composition.proxyPath),
      ),
  );

  return (
    <AuthenticatedShell
      overlayViews={overlayViews}
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
