'use client';

import { signIn } from 'next-auth/react';

import type { LoginCredentials } from '@/services/auth/auth.types';

import type { LoginResult } from './auth.types';

/** Use the configured credentials provider so CSRF and session cookies stay with NextAuth. */
export async function signInWithCredentials(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    const result = await signIn('credentials', { ...credentials, redirect: false });
    if (!result?.ok || result.error) {
      return {
        success: false,
        error: result?.error === 'CredentialsSignin' ? 'CredentialsSignin' : 'Configuration',
      };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Configuration' };
  }
}
