import { z } from 'zod';

export function createDebtFormSchema(ui: (key: string) => string) {
  const optionalDate = z.string().optional();
  const positiveNumberString = z
    .string({ required_error: ui('enterAnAmount'), invalid_type_error: ui('enterAValidNumber') })
    .trim()
    .min(1, ui('enterAnAmount'))
    .refine((value) => Number.isFinite(Number(value)), ui('enterAValidNumber'))
    .refine((value) => Number(value) > 0, ui('theAmountMustBeGreaterThanZero'));

  const debtFormSchema = z
    .object({
      type: z.enum(['RECEIVABLE', 'PAYABLE']),
      partyId: z.string().min(1, ui('selectAPartnerText')),
      assignedToId: z.string().trim().optional(),
      title: z.string().trim().min(1, ui('enterADebtTitle')),
      invoiceNo: z.string().trim().optional(),
      orderNo: z.string().trim().optional(),
      contractNo: z.string().trim().optional(),
      originalAmount: positiveNumberString,
      issueDate: z.string().min(1, ui('selectAnIssueDate')),
      dueDate: z.string().min(1, ui('selectADueDate')),
      nextFollowUpAt: optionalDate,
      followUpNote: z.string().trim().optional(),
      description: z.string().trim().optional(),
      salesChannel: z.enum(['STORE', 'ONLINE', 'WHOLESALE']).optional(),
      items: z.array(
        z.object({
          productId: z.string(),
          quantity: positiveNumberString,
          unitPrice: positiveNumberString,
        }),
      ),
    })
    .refine((value) => !value.issueDate || !value.dueDate || value.dueDate >= value.issueDate, {
      message: ui('theDueDateMustBeOnOrAfterThe'),
      path: ['dueDate'],
    });

  return debtFormSchema;
}

export type DebtFormInput = z.input<ReturnType<typeof createDebtFormSchema>>;
export type DebtFormValues = z.output<ReturnType<typeof createDebtFormSchema>>;
