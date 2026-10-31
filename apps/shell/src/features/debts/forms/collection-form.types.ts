export type CollectionFormProps = {
  debtId: string;
  defaults: {
    assignedToId?: string | null;
    collectionStatus: string;
    nextFollowUpAt?: Date | null;
    followUpNote?: string | null;
    invoiceNo?: string | null;
    orderNo?: string | null;
    contractNo?: string | null;
    poNo?: string | null;
  };
  users: Array<{ id: string; name: string; email: string }>;
};
