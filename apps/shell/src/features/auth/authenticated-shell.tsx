'use client';

import { type ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';

import { signOutFromPlatform } from '@packages/platform-sdk';
import { AppShell, SignOutDialog } from '@packages/ui-react';

export function AuthenticatedShell(props: ComponentProps<typeof AppShell>) {
  const t = useTranslations('SignOut');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AppShell {...props} onSignOut={() => setIsOpen(true)} />
      {isOpen ? (
        <SignOutDialog
          title={t('title')}
          confirmation={t('confirmation')}
          cancelLabel={t('cancel')}
          errorMessage={t('error')}
          onCancel={() => setIsOpen(false)}
          onConfirm={() => signOutFromPlatform(window.location.origin)}
        />
      ) : null}
    </>
  );
}
