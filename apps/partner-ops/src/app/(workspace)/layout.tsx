import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Box } from '@mui/material';

import { buildLoginUrl } from '@packages/platform-sdk';
import { designTokens } from '@packages/ui-tokens';

import { StandaloneWorkspaceHeader } from '@/components/layouts/standalone-workspace-header';
import { EmbeddedPlatformBridge } from '@/components/platform/embedded-platform-bridge';
import { getCoreIdentity } from '@/lib/core-session';
import { partnerOpsEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

function loginUrlFor(returnTo: string | null) {
  return buildLoginUrl(partnerOpsEnv.PLATFORM_ORIGIN, returnTo ?? '/');
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [identity, requestHeaders] = await Promise.all([getCoreIdentity(), headers()]);

  if (!identity) {
    const returnTo = requestHeaders.get('x-debtflow-return-to');
    redirect(loginUrlFor(returnTo));
  }

  if (requestHeaders.get('x-debtflow-overlay') === '1') return children;

  const embedded = requestHeaders.get('x-debtflow-embed') === '1';

  return (
    <Box
      data-page-viewport
      sx={{
        display: 'flex',
        flexDirection: 'column',
        containerType: 'inline-size',
        containerName: 'page-viewport',
        height: '100dvh',
        minHeight: 0,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      {embedded ? (
        <EmbeddedPlatformBridge />
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
          p: designTokens.layout.contentPadding,
        }}
      >
        <Box sx={{ display: 'flex', flex: '1 1 auto', minHeight: 0, minWidth: 0 }}>{children}</Box>
      </Box>
    </Box>
  );
}
