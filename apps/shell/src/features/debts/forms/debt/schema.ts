import { z } from 'zod';

import {
  MONEY_DECIMAL_PATTERN,
  normalizePositiveDecimal,
  QUANTITY_DECIMAL_PATTERN,
} from '@/lib/forms/decimal';

import { sumDebtLineAmounts } from './line-item-totals';

export function createDebtFormSchema(ui: (key: string) => string) {
  const optionalDate = z.string().optional();
  const positiveDecimal = (pattern: RegExp) =>
    z
      .string({ required_error: ui('enterAnAmount'), invalid_type_error: ui('enterAValidNumber') })
      .trim()
      .min(1, ui('enterAnAmount'))
      .transform((value, context) => {
        const normalized = normalizePositiveDecimal(value, pattern);
        if (normalized) return normalized;
        context.addIssue({ code: z.ZodIssueCode.custom, message: ui('enterAValidNumber') });
        return z.NEVER;
      });

  const debtFormSchema = z
    .object({
      type: z.enum(['RECEIVABLE', 'PAYABLE']),
      partyId: z.string().min(1, ui('selectAPartnerText')),
      assignedToId: z.string().trim().optional(),
      title: z.string().trim().min(1, ui('enterADebtTitle')),
      invoiceNo: z.string().trim().optional(),
      orderNo: z.string().trim().optional(),
      contractNo: z.string().trim().optional(),
      originalAmount: z.string(),
      issueDate: z.string().min(1, ui('selectAnIssueDate')),
      dueDate: z.string().min(1, ui('selectADueDate')),
      nextFollowUpAt: optionalDate,
      followUpNote: z.string().trim().optional(),
      description: z.string().trim().optional(),
      salesChannel: z.enum(['STORE', 'ONLINE', 'WHOLESALE']).optional(),
      items: z.array(
        z
          .object({
            productId: z.string(),
            quantity: positiveDecimal(QUANTITY_DECIMAL_PATTERN),
            unitPrice: positiveDecimal(MONEY_DECIMAL_PATTERN),
          })
          .refine(
            (item) =>
              normalizePositiveDecimal(sumDebtLineAmounts([item]), MONEY_DECIMAL_PATTERN) !== null,
            { message: ui('enterAValidNumber'), path: ['unitPrice'] },
          ),
      ),
    })
    .refine((value) => !value.issueDate || !value.dueDate || value.dueDate >= value.issueDate, {
      message: ui('theDueDateMustBeOnOrAfterThe'),
      path: ['dueDate'],
    })
    .transform((value, context) => {
      const amount = value.items.length ? sumDebtLineAmounts(value.items) : value.originalAmount;
      const originalAmount = normalizePositiveDecimal(amount, MONEY_DECIMAL_PATTERN);
      if (!originalAmount) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: ui('enterAValidNumber'),
          path: ['originalAmount'],
        });
        return z.NEVER;
      }
      return { ...value, originalAmount };
    });

  return debtFormSchema;
}

export type DebtFormInput = z.input<ReturnType<typeof createDebtFormSchema>>;
export type DebtFormValues = z.output<ReturnType<typeof createDebtFormSchema>>;
