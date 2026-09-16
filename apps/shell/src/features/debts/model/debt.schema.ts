import { z } from 'zod';
import { CollectionStatus, DebtStatus, DebtType } from '@/lib/domain/enums';
import { optionalQueryEnum, optionalQueryValue } from '@/lib/validation/query-schema';

export const debtSchema = z.object({
  type: z.nativeEnum(DebtType),
  partyId: z.string().min(1),
  assignedToId: z.string().trim().optional().nullable(),
  title: z.string().trim().min(1, 'Tiêu đề là bắt buộc'),
  invoiceNo: z.string().trim().optional().nullable(),
  orderNo: z.string().trim().optional().nullable(),
  contractNo: z.string().trim().optional().nullable(),
  poNo: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  originalAmount: z.coerce.number().positive('Số tiền phải lớn hơn 0'),
  currency: z.string().trim().default('VND'),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  collectionStatus: z.nativeEnum(CollectionStatus).optional(),
  nextFollowUpAt: z.coerce.date().optional().nullable(),
  followUpNote: z.string().trim().optional().nullable(),
});

export const debtQuerySchema = z.object({
  q: optionalQueryValue(z.string()),
  type: optionalQueryEnum(z.nativeEnum(DebtType)),
  status: optionalQueryEnum(z.nativeEnum(DebtStatus)),
  collectionStatus: optionalQueryEnum(z.nativeEnum(CollectionStatus)),
  partyId: optionalQueryValue(z.string()),
  provinceCode: optionalQueryValue(z.string()),
  categoryId: optionalQueryValue(z.string()),
  brandId: optionalQueryValue(z.string()),
  productId: optionalQueryValue(z.string()),
  salesChannel: optionalQueryValue(z.enum(['STORE', 'ONLINE', 'WHOLESALE'])),
  assignedToId: optionalQueryValue(z.string()),
  aging: optionalQueryValue(z.enum(['not_due', '1_7', '8_30', '31_60', '60_plus'])),
  followUp: optionalQueryValue(z.enum(['today', 'overdue', 'upcoming'])),
  dueRange: optionalQueryValue(z.enum(['today', 'tomorrow', 'next_7_days', 'this_month'])),
  dueDate: optionalQueryValue(z.string()),
  overdue: z.coerce.boolean().optional(),
  outstanding: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(1000).default(20),
});
