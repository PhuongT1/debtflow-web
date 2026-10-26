'use client';

import { alpha, Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import { AppIcon, type AppIconName } from '@/components/ui/app-icon';

function FeatureIcon({ icon, tone }: { icon: AppIconName; tone: 'blue' | 'cyan' | 'green' }) {
  const paletteTones = { blue: 'primary', cyan: 'info', green: 'success' } as const;
  const paletteTone = paletteTones[tone];

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: alpha(theme.palette[paletteTone].light, 0.16),
        borderRadius: '8px',
        color: `${paletteTone}.light`,
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
  const t = useTranslations('Login');

  return (
    <Box
      sx={{
        bgcolor: 'primary.dark',
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
              fontWeight: 850,
              height: 42,
              placeItems: 'center',
              width: 42,
            }}
          >
            DF
          </Box>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 850 }}>Debt Flow</Typography>
            <Typography
              sx={(theme) => ({
                color: alpha(theme.palette.primary.contrastText, 0.72),
                fontSize: 12,
              })}
            >
              {t('workspace')}
            </Typography>
          </Box>
        </Box>
        <Typography
          component="p"
          sx={{ fontSize: 32, fontWeight: 820, lineHeight: 1.25, mt: 7, maxWidth: 360 }}
        >
          {t('headline')}
        </Typography>
        <Typography
          sx={(theme) => ({
            color: alpha(theme.palette.primary.contrastText, 0.78),
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
          [t('trackDebts'), 'dashboard', 'blue'],
          [t('prioritizeOverdue'), 'calendar', 'cyan'],
          [t('paymentHistory'), 'payments', 'green'],
        ].map(([label, icon, tone]) => (
          <Box key={label} sx={{ alignItems: 'center', display: 'flex', gap: 1.5 }}>
            <FeatureIcon icon={icon as AppIconName} tone={tone as 'blue' | 'cyan' | 'green'} />
            <Typography
              sx={(theme) => ({
                color: alpha(theme.palette.primary.contrastText, 0.9),
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
