export type DebtFormProps = {
  parties?: Array<{ id: string; name: string }>;
  users?: Array<{ id: string; name: string; email: string }>;
  defaultPartyId?: string;
  lockParty?: boolean;
  onSuccess?: () => void;
};
