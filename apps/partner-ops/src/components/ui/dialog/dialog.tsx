'use client';

import { PlatformDialog, type PlatformDialogProps, useToast } from '@packages/ui-react';
import { partnerPlatform } from '@/lib/platform/client';
import { useTranslations } from 'next-intl';

/** App-level modal boundary: standalone renders children; embedded requests
 * the registered view through partnerPlatform and handles its returned result. */
export function AppDialog(props: Omit<PlatformDialogProps, 'openRemote' | 'hostOrigin'>) {
  const t = useTranslations('Common');
  const { showToast } = useToast();
  const { onCompleted, ...rest } = props;
  return (
    <PlatformDialog
      openRemote={partnerPlatform.openOverlay}
      errorLabel={t('overlayUnavailable')}
      {...rest}
      onFailure={() => showToast({ message: t('overlayUnavailable'), severity: 'error' })}
      onCompleted={(result) => {
        if (result.message) showToast({ message: result.message });
        onCompleted?.(result);
      }}
    />
  );
}
