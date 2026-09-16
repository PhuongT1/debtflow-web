import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { Box } from '@mui/material';
import { StandaloneWorkspaceHeader } from '@/components/layouts/standalone-workspace-header';
import { EmbeddedNavigationBridge } from '@/components/platform/embedded-navigation-bridge';
import { getCoreIdentity } from '@/lib/core-session';
import { partnerOpsEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

function loginUrlFor(returnTo: string | null) {
  const loginUrl = new URL('/login', partnerOpsEnv.PLATFORM_ORIGIN);
  if (returnTo) loginUrl.searchParams.set('returnTo', returnTo);
  return loginUrl.toString();
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [identity, requestHeaders] = await Promise.all([getCoreIdentity(), headers()]);

  if (!identity) {
    const returnTo = requestHeaders.get('x-debtflow-return-to');
    redirect(loginUrlFor(returnTo));
  }

  const embedded = requestHeaders.get('x-debtflow-embed') === '1';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {embedded ? (
        <EmbeddedNavigationBridge />
      ) : (
        <StandaloneWorkspaceHeader
          identity={identity}
          platformOrigin={partnerOpsEnv.PLATFORM_ORIGIN}
        />
      )}
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          minHeight: 0,
          minWidth: 0,
          overflow: 'hidden',
          p: { xs: 1.25, md: 1.5 },
        }}
      >
        <Box sx={{ display: 'flex', flex: '1 1 auto', minHeight: 0, minWidth: 0 }}>{children}</Box>
      </Box>
    </Box>
  );
}
