import { redirect } from 'next/navigation';
import { AppShell } from '@debtflow/react-ui';
import { auth } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function MinimalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user || session.error === 'RefreshTokenError') {
    redirect('/login');
  }

  return (
    <AppShell
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
    </AppShell>
  );
}
