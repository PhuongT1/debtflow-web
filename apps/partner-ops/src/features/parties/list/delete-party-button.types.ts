import type { Party } from '@/models/party';

export type DeletePartyButtonProps = Pick<Party, 'id'> & {
  label: string;
  confirmMessage: string;
};
