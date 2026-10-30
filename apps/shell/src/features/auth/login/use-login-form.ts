'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { signInWithCredentials } from '@/lib/auth/client';

import type { LoginFormProps } from './login.types';
import { demoLoginValues, loginSchema, type LoginValues } from './schema';

/** Own form state and the successful-login journey; render fields in LoginForm. */
export function useLoginForm({ initialError, returnTo }: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(initialError);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: demoLoginValues,
  });

  async function handleLogin(values: LoginValues) {
    setSubmitError(null);
    const result = await signInWithCredentials(values);
    if (!result.success) {
      setSubmitError(result.error);
      return;
    }
    if (returnTo.startsWith('http://') || returnTo.startsWith('https://')) {
      window.location.replace(returnTo);
      return;
    }
    router.replace(returnTo);
    router.refresh();
  }

  function handleUseDemoAccount() {
    form.reset();
    setSubmitError(null);
    setShowPassword(false);
  }

  return {
    control: form.control,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    handleSubmit: form.handleSubmit(handleLogin),
    handleUseDemoAccount,
    showPassword,
    togglePassword: () => setShowPassword((current) => !current),
    submitError,
  };
}
