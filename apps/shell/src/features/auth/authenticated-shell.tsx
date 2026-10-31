'use client';

import { type ComponentProps, useState } from 'react';
import { useTranslations } from 'next-intl';

import { signOutFromPlatform } from '@packages/platform-sdk';
import { AppShell, SignOutDialog } from '@packages/ui-react';

import { ShellOverlays } from '@/components/microfrontends/shell-overlays';

type AuthenticatedShellProps = ComponentProps<typeof AppShell> & {
  overlayViews?: Record<string, string>;
};

export function AuthenticatedShell({ overlayViews = {}, ...props }: AuthenticatedShellProps) {
  const t = useTranslations('SignOut');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ShellOverlays views={overlayViews}>
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
    </ShellOverlays>
  );
}
