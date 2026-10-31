import Link from 'next/link';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import type { PublicLayoutProps } from './layout.types';

/** Public, SEO-friendly shell. It deliberately has no session dependency. */
export default function PublicLayout({ children }: PublicLayoutProps) {
  const ui = useTranslations('Workspace');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
            minHeight: 64,
            mx: 'auto',
            maxWidth: 1440,
            px: { xs: 1.5, md: 2.5 },
            width: '100%',
          }}
        >
          <Stack spacing={0}>
            <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{ui('debtFlowPartners')}</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 12 }}>
              Partner Operations
            </Typography>
          </Stack>
          <Button component={Link} href="/parties" size="small" variant="outlined">
            {ui('openWorkspace')}
          </Button>
        </Box>
        <Box
          component="nav"
          aria-label={ui('partnerOperationsNavigation')}
          sx={{ borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              mx: 'auto',
              maxWidth: 1440,
              overflowX: 'auto',
              px: { xs: 1.5, md: 2.5 },
              py: 0.75,
              width: '100%',
            }}
          >
            <Button component={Link} href="/" size="small" variant="contained">
              {ui('overview')}
            </Button>
            <Button component={Link} href="/parties" size="small" variant="text">
              {ui('partners')}
            </Button>
          </Stack>
        </Box>
      </Box>
      <Box component="main" sx={{ display: 'flex', flex: '1 1 auto', minHeight: 0 }}>
        {children}
      </Box>
    </Box>
  );
}
