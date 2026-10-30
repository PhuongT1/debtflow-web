'use client';

import { Alert, Box, IconButton, InputAdornment, Typography, useTheme } from '@mui/material';
import { useTranslations } from 'next-intl';

import { FormInput } from '@packages/ui-react';

import { AppIcon } from '@/components/ui/app-icon';
import { Button } from '@/components/ui/button';

import type { LoginFormProps } from './login.types';
import { LoginBrandPanel } from './login-brand-panel';
import { getLoginErrorKey } from './login-error';
import { useLoginForm } from './use-login-form';

export function LoginForm(props: LoginFormProps) {
  const theme = useTheme();
  const t = useTranslations('Login');
  const {
    control,
    errors,
    isSubmitting,
    handleSubmit,
    handleUseDemoAccount,
    showPassword,
    togglePassword,
    submitError,
  } = useLoginForm(props);

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        display: 'grid',
        flex: 1,
        placeItems: 'center',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          boxShadow: theme.customShadows.dialog,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(340px, 0.9fr) minmax(420px, 1.1fr)' },
          maxWidth: 980,
          minHeight: { md: 610 },
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <LoginBrandPanel />

        <Box sx={{ alignSelf: 'center', p: { xs: 3, sm: 5, md: 6 } }}>
          <Box sx={{ alignItems: 'center', display: { xs: 'flex', md: 'none' }, gap: 1, mb: 4 }}>
            <Box
              sx={{
                bgcolor: 'primary.main',
                borderRadius: 1,
                color: 'primary.contrastText',
                display: 'grid',
                fontSize: 13,
                fontWeight: 700,
                height: 38,
                placeItems: 'center',
                width: 38,
              }}
            >
              DF
            </Box>
            <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Debt Flow</Typography>
          </Box>
          <Typography component="h1" sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 700 }}>
            {t('welcome')}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t('signInDescription')}
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ display: 'grid', gap: 2.25, mt: 4 }}
          >
            <FormInput
              autoComplete="email"
              autoFocus
              error={Boolean(errors.email)}
              helperText={errors.email ? t('invalidEmail') : undefined}
              label={t('email')}
              required
              type="email"
              control={control}
              name="email"
            />
            <FormInput
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password ? t('passwordRequired') : undefined}
              label={t('password')}
              required
              type={showPassword ? 'text' : 'password'}
              control={control}
              name="password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={t(showPassword ? 'hidePassword' : 'showPassword')}
                        edge="end"
                        onClick={togglePassword}
                        size="small"
                      >
                        <AppIcon
                          fontSize="small"
                          name={showPassword ? 'visibilityOff' : 'visibility'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            {submitError ? (
              <Alert severity="error">{t(getLoginErrorKey(submitError))}</Alert>
            ) : null}
            <Button
              disabled={isSubmitting}
              onClick={handleUseDemoAccount}
              type="button"
              variant="secondary"
            >
              {t('useDemoAccount')}
            </Button>
            <Button loading={isSubmitting} size="large" sx={{ mt: 0.5 }} type="submit">
              {t('signIn')}
            </Button>
          </Box>
          <Typography color="text.secondary" sx={{ fontSize: 11.5, mt: 4, textAlign: 'center' }}>
            {t('securityNote')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
