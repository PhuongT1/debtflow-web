'use client';
import { useEffect } from 'react';
import { z } from 'zod';
import { Alert, Box } from '@mui/material';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { useOverlaySurface } from '@packages/ui-react';
import { HelpModal } from '@/components/ui/dialog/help-modal';
import { FormDialog } from '@/components/ui/dialog/form-dialog';
import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import { PartyForm, createPartyFormSchema, useDeleteParty } from '@/features/parties';
import { useActiveUsers } from '@/hooks/use-active-users';
import type { OverlayContentProps } from './content.types';

function InvalidSurface() {
  const surface = useOverlaySurface();
  const t = useTranslations('Common');
  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error">{t('overlayUnavailable')}</Alert>
      <Button onClick={() => surface?.finish({ status: 'failed' })}>{t('close')}</Button>
    </Box>
  );
}
function PartyFormSurface({ input }: OverlayContentProps) {
  const t = useTranslations('Parties');
  const formText = useTranslations('PartyForm');
  const users = useActiveUsers();
  const markReady = useOverlaySurface()?.markReady;
  useEffect(() => {
    if (!users.isPending) markReady?.();
  }, [users.isPending, markReady]);
  const parsed = createPartyFormSchema(formText)
    .partial()
    .safeParse(input.initialValues ?? {});
  const partyId = typeof input.partyId === 'string' ? input.partyId : undefined;
  const title = partyId
    ? t('viewDialog', { name: parsed.success ? (parsed.data.name ?? '') : '' })
    : t('add');
  if (users.isPending) return null;
  if (!parsed.success || users.isError) return <InvalidSurface />;
  return (
    <FormDialog
      surface
      buttonLabel={title}
      title={title}
      description={partyId ? t('viewDescription') : t('addDescription')}
    >
      <PartyForm
        users={users.data ?? []}
        partyId={partyId}
        initialValues={parsed.data}
        submitLabel={partyId ? t('save') : undefined}
      />
    </FormDialog>
  );
}
function PartyDeleteSurface({ input }: OverlayContentProps) {
  const t = useTranslations('Parties');
  const mutation = useDeleteParty();
  if (typeof input.id !== 'string') return <InvalidSurface />;
  const id = input.id;
  return (
    <ConfirmActionButton
      surface
      onConfirm={() => mutation.mutateAsync({ id })}
      isPending={mutation.isPending}
      error={mutation.error}
      onReset={mutation.reset}
      label={t('delete')}
      confirmMessage={t('deleteMessage')}
    />
  );
}
const helpSchema = z.object({
  title: z.string(),
  description: z.string(),
  steps: z.array(z.string()).max(30),
  tips: z.array(z.string()).max(30).optional(),
});
export function OverlayContent() {
  // Warm the small options query once per retained runtime, not on every click.
  useActiveUsers();
  const surface = useOverlaySurface();
  const viewId = surface?.request.view;
  const markReady = surface?.markReady;
  useEffect(() => {
    if (viewId && viewId !== 'party-form') markReady?.();
  }, [viewId, markReady]);
  if (!surface) return null;
  const { view, input = {} } = surface.request;
  if (view === 'party-form') return <PartyFormSurface input={input} />;
  if (view === 'party-delete') return <PartyDeleteSurface input={input} />;
  const help = helpSchema.safeParse(input);
  if (view === 'help' && help.success) return <HelpModal surface {...help.data} />;
  return <InvalidSurface />;
}
