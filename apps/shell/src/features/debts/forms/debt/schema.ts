import { z } from 'zod';

const optionalDate = z.string().optional();
const positiveNumberString = z
  .string()
  .trim()
  .min(1, 'Vui lòng nhập số tiền')
  .refine((value) => Number.isFinite(Number(value)), 'Vui lòng nhập số hợp lệ')
  .refine((value) => Number(value) > 0, 'Số tiền phải lớn hơn 0');

export const debtFormSchema = z
  .object({
    type: z.enum(['RECEIVABLE', 'PAYABLE']),
    partyId: z.string().min(1, 'Vui lòng chọn đối tác'),
    assignedToId: z.string().trim().optional(),
    title: z.string().trim().min(1, 'Vui lòng nhập tiêu đề công nợ'),
    invoiceNo: z.string().trim().optional(),
    orderNo: z.string().trim().optional(),
    contractNo: z.string().trim().optional(),
    originalAmount: positiveNumberString,
    issueDate: z.string().min(1, 'Vui lòng chọn ngày phát sinh'),
    dueDate: z.string().min(1, 'Vui lòng chọn ngày đến hạn'),
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
    message: 'Ngày đến hạn phải sau hoặc bằng ngày phát sinh',
    path: ['dueDate'],
  });

export type DebtFormInput = z.input<typeof debtFormSchema>;
export type DebtFormValues = z.output<typeof debtFormSchema>;
