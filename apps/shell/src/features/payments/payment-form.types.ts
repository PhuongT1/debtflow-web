export type PaymentFormProps = {
  debtId: string;
  remainingAmount: number;
  partyId: string;
  type: 'PAYABLE' | 'RECEIVABLE';
  onSuccess?: () => void;
};
