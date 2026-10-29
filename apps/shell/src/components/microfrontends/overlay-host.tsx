'use client';
import { OverlayHost as SharedOverlayHost } from '@packages/ui-react';
import { useTranslations } from 'next-intl';
import type { EmbeddedOverlayHostProps } from './microfrontends.types';

export function OverlayHost(props: EmbeddedOverlayHostProps) {
  const t = useTranslations('Overlay');
  return <SharedOverlayHost {...props} closeLabel={t('close')} loadingLabel={t('opening')} />;
}
