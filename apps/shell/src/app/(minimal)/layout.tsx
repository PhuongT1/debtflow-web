import { AuthenticatedShell } from '@/features/auth';
import { requirePageSession } from '@/lib/auth/session';

import type { MinimalLayoutProps } from './layout.types';

export const dynamic = 'force-dynamic';

export default async function MinimalLayout({ children }: MinimalLayoutProps) {
  const session = await requirePageSession();

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
