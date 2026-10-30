'use client';

import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';
import type { Party } from '@/models/party';

import { useDeleteParty } from '../hooks/use-delete-party';
import { useRefreshParties } from '../hooks/use-refresh-parties';

export function DeletePartyButton({
  id,
  label,
  confirmMessage,
}: Pick<Party, 'id'> & {
  label: string;
  confirmMessage: string;
}) {
  const refresh = useRefreshParties();
  const mutation = useDeleteParty();
  return (
    <ConfirmActionButton
      remote={{ view: 'party-delete', title: label, size: 'xs', input: { id } }}
      onCompleted={refresh}
      onConfirm={() => mutation.mutateAsync({ id })}
      isPending={mutation.isPending}
      error={mutation.error}
      onReset={mutation.reset}
      label={label}
      confirmMessage={confirmMessage}
    />
  );
}
