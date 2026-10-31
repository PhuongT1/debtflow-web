import Link from 'next/link';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const ui = await getTranslations('Workspace');

  return {
    title: 'Partner Operations | Debt Flow',
    description: ui('theCustomerAndSupplierApplicationInDebtFlow'),
  };
}

export default function PartnerOpsLandingPage() {
  const ui = useTranslations('Workspace');

  const capabilities = [
    ui('customerAndSupplierDirectory'),
    ui('searchFilterAndPaginatePartnerRecords'),
    ui('manageCreditLimitsContactsAndAccountOwners'),
  ];

  return (
    <Box
      component="section"
      sx={{
        display: 'grid',
        flex: '1 1 auto',
        minHeight: 0,
        placeItems: 'center',
        px: { xs: 2, md: 4 },
        py: { xs: 5, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 760, width: '100%' }}>
        <Chip color="primary" label="Debt Flow · Partner Operations" size="small" />
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 34, md: 52 },
            fontWeight: 850,
            letterSpacing: -1.5,
            lineHeight: 1.08,
            mt: 2.25,
          }}
        >
          {ui('managePartnersIndependentlyWithSharedAccess')}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{
            fontSize: { xs: 16, md: 19 },
            lineHeight: 1.7,
            maxWidth: 680,
            mt: 2.5,
          }}
        >
          {ui('partnerOpsManagesCustomersAndSuppliersInDebtFlow')}
        </Typography>
        <Stack component="ul" spacing={1.25} sx={{ color: 'text.secondary', mt: 3.5, pl: 2.5 }}>
          {capabilities.map((capability) => (
            <Typography component="li" key={capability}>
              {capability}
            </Typography>
          ))}
        </Stack>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
          <Button component={Link} href="/parties" size="large" variant="contained">
            {ui('openWorkspace')}
          </Button>
          <Button component="a" href="/api/health" size="large" variant="outlined">
            {ui('checkApplicationStatus')}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
