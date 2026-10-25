'use client';

import { useState, type ComponentProps } from 'react';
import { AppShell, SignOutDialog } from '@debtflow/react-ui';
import { signOutFromPlatform } from '@debtflow/platform-sdk';
import { useTranslations } from 'next-intl';

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
