import type { PartyFormInitialValues } from './schema';

export type PartyFormProps = {
  users?: Array<{ id: string; name: string; email: string }>;
  initialValues?: PartyFormInitialValues;
  partyId?: string;
  submitLabel?: string;
};
