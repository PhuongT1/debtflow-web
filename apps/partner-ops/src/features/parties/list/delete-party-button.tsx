'use client';

import { ConfirmActionButton } from '@/components/ui/dialog/confirm-action-button';

import { useDeleteParty } from '../hooks/use-delete-party';
import { useRefreshParties } from '../hooks/use-refresh-parties';

import type { DeletePartyButtonProps } from './delete-party-button.types';

export function DeletePartyButton({ id, label, confirmMessage }: DeletePartyButtonProps) {
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
