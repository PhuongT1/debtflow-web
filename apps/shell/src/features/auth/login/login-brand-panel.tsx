'use client';

import { Box, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

function FeatureIcon({ icon }: { icon: AppIconName }) {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.contrastText} 12%, transparent)`,
        borderRadius: 1,
        color: 'primary.contrastText',
        display: 'grid',
        flex: '0 0 auto',
        height: 38,
        placeItems: 'center',
        width: 38,
      })}
    >
      <AppIcon fontSize="small" name={icon} />
    </Box>
  );
}

export function LoginBrandPanel() {
  const theme = useTheme();
  const t = useTranslations('Login');

  return (
    <Box
      sx={{
        background: theme.brandPanel,
        color: 'primary.contrastText',
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 5,
      }}
    >
      <Box>
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 1.25 }}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              borderRadius: '9px',
              display: 'grid',
              fontSize: 15,
              fontWeight: 700,
              height: 42,
              placeItems: 'center',
              width: 42,
            }}
          >
            DF
          </Box>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Debt Flow</Typography>
            <Typography
              sx={(theme) => ({
                color: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.contrastText} 72%, transparent)`,
                fontSize: 12,
              })}
            >
              {t('workspace')}
            </Typography>
          </Box>
        </Box>
        <Typography
          component="p"
          sx={{ fontSize: 32, fontWeight: 700, lineHeight: 1.25, mt: 7, maxWidth: 360 }}
        >
          {t('headline')}
        </Typography>
        <Typography
          sx={(theme) => ({
            color: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.contrastText} 78%, transparent)`,
            fontSize: 15,
            lineHeight: 1.7,
            mt: 2,
            maxWidth: 360,
          })}
        >
          {t('description')}
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gap: 2.25 }}>
        {[
          [t('trackDebts'), 'dashboard'],
          [t('prioritizeOverdue'), 'calendar'],
          [t('paymentHistory'), 'payments'],
        ].map(([label, icon]) => (
          <Box key={label} sx={{ alignItems: 'center', display: 'flex', gap: 1.5 }}>
            <FeatureIcon icon={icon as AppIconName} />
            <Typography
              sx={(theme) => ({
                color: `color-mix(in srgb, ${(theme.vars ?? theme).palette.primary.contrastText} 90%, transparent)`,
                fontSize: 13.5,
                fontWeight: 600,
              })}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
