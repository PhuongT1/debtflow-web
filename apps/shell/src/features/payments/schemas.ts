import { z } from 'zod';
import { PaymentMethod } from '@/lib/domain/enums';

export const paymentSchema = z.object({
  amount: z.coerce.number().positive('Số tiền thanh toán phải lớn hơn 0'),
  paidAt: z.coerce.date(),
  method: z.nativeEnum(PaymentMethod).default(PaymentMethod.BANK_TRANSFER),
  referenceNo: z.string().trim().optional().nullable(),
  note: z.string().trim().optional().nullable(),
});
