export type SignOutDialogProps = {
  title: string;
  confirmation: string;
  cancelLabel: string;
  errorMessage: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
};
