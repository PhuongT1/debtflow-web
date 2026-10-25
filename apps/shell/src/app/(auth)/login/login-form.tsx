'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, IconButton, InputAdornment, Typography } from '@mui/material';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/input';
import { getLoginErrorKey } from './login-error';
import { LoginBrandPanel } from './login-brand-panel';

const loginSchema = z.object({
  email: z.string().trim().email('invalidEmail'),
  password: z.string().min(1, 'passwordRequired'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm({
  initialError,
  returnTo,
}: {
  initialError: string | null;
  returnTo: string;
}) {
  const router = useRouter();
  const t = useTranslations('Login');
  const [submitError, setSubmitError] = useState<string | null>(initialError);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'owner@anphu-fashion.demo',
      password: 'Demo@123456',
    },
  });

  async function onSubmit(values: LoginValues) {
    setSubmitError(null);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!result || result.error || !result.ok) {
        setSubmitError(result?.error ?? 'Configuration');
        return;
      }
    } catch {
      setSubmitError('Configuration');
      return;
    }

    if (returnTo.startsWith('http://') || returnTo.startsWith('https://')) {
      window.location.replace(returnTo);
      return;
    }

    router.replace(returnTo);
    router.refresh();
  }

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
          borderRadius: '12px',
          boxShadow: 12,
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
                borderRadius: '8px',
                color: 'primary.contrastText',
                display: 'grid',
                fontSize: 13,
                fontWeight: 850,
                height: 38,
                placeItems: 'center',
                width: 38,
              }}
            >
              DF
            </Box>
            <Typography sx={{ fontSize: 17, fontWeight: 850 }}>Debt Flow</Typography>
          </Box>
          <Typography component="h1" sx={{ fontSize: { xs: 26, sm: 30 }, fontWeight: 850 }}>
            {t('welcome')}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t('signInDescription')}
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: 'grid', gap: 2.25, mt: 4 }}
          >
            <AppInput
              autoComplete="email"
              autoFocus
              error={Boolean(errors.email)}
              helperText={errors.email ? t('invalidEmail') : undefined}
              label={t('email')}
              required
              type="email"
              {...register('email')}
            />
            <AppInput
              autoComplete="current-password"
              error={Boolean(errors.password)}
              helperText={errors.password ? t('passwordRequired') : undefined}
              label={t('password')}
              required
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={t(showPassword ? 'hidePassword' : 'showPassword')}
                        edge="end"
                        onClick={() => setShowPassword((current) => !current)}
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
              onClick={() => {
                reset();
                setSubmitError(null);
                setShowPassword(false);
              }}
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
