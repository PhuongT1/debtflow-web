import { redirect } from 'next/navigation';

import { AuthenticatedShell } from '@/features/auth';
import { getRequestedLoginUrl } from '@/lib/auth/login-navigation';
import { auth } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function MinimalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.error === 'RefreshTokenError') {
    redirect(await getRequestedLoginUrl());
  }

  return (
    <AuthenticatedShell
      currentZone="shell"
      identity={{
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        organization: session.user.organization,
      }}
      variant="minimal"
    >
      {children}
    </AuthenticatedShell>
  );
}
