'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { OverlayHost } from '@packages/ui-react';

import type { ShellOverlaysProps } from './shell-overlays.types';

const AvailableViews = createContext<readonly string[]>([]);
export function useAvailableOverlayViews() {
  return useContext(AvailableViews);
}
export function ShellOverlays({ views, children }: ShellOverlaysProps) {
  const t = useTranslations('Overlay');
  const [ownerWindow, setOwnerWindow] = useState<Window>();
  useEffect(() => setOwnerWindow(window), []);
  return (
    <AvailableViews.Provider value={Object.keys(views)}>
      {children}
      {ownerWindow && Object.keys(views).length > 0 ? (
        <OverlayHost
          ownerWindow={ownerWindow}
          views={views}
          closeLabel={t('close')}
          loadingLabel={t('opening')}
        />
      ) : null}
    </AvailableViews.Provider>
  );
}
