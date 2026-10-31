'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { openPlatformOverlay } from '@packages/platform-sdk';
import { useToast } from '@packages/ui-react';

import { useAvailableOverlayViews } from '@/components/microfrontends/shell-overlays';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/lib/query/query-keys';

import type { PartnerDebtSummary } from './types';

export interface PartnerDetailsDialogProps {
  partner: Pick<PartnerDebtSummary, 'id' | 'name'>;
}
export function PartnerDetailsDialog({ partner }: PartnerDetailsDialogProps) {
  const t = useTranslations('Parties');
  const views = useAvailableOverlayViews();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  const open = async () => {
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setPending(true);
    const result = await openPlatformOverlay({
      hostOrigin: window.location.origin,
      signal: controller.signal,
      request: {
        view: 'party-form',
        title: t('editTitle', { name: partner.name }),
        input: { partyId: partner.id },
      },
    });
    request.current = null;
    if (controller.signal.aborted) return;
    setPending(false);
    if (result.status === 'completed')
      await queryClient.invalidateQueries({ queryKey: queryKeys.partnerSummary.all });
    if (result.status === 'failed') showToast({ message: t('unavailable'), severity: 'error' });
  };
  return (
    <Button
      loading={pending}
      disabled={!views.includes('party-form')}
      onClick={() => void open()}
      size="small"
      variant="secondary"
    >
      {t('edit')}
    </Button>
  );
}
