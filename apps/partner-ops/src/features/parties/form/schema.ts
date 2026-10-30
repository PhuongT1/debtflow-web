import { z } from 'zod';

import { PartyType } from '@/lib/domain';

export function createPartyFormSchema(t: (key: string) => string) {
  const optionalNumberString = z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number.isFinite(Number(value)), t('invalidNumber'))
    .refine((value) => !value || Number(value) >= 0, t('negativeCreditLimit'));

  const partyFormSchema = z.object({
    type: z.nativeEnum(PartyType),
    code: z.string().trim().optional(),
    name: z.string().trim().min(1, t('nameRequired')),
    phone: z.string().trim().optional(),
    email: z.string().trim().email(t('invalidEmail')).optional().or(z.literal('')),
    taxCode: z.string().trim().optional(),
    creditLimit: optionalNumberString,
    assignedToId: z.string().trim().optional(),
    address: z.string().trim().optional(),
    provinceCode: z.string().trim().max(10, t('provinceCodeLength')).optional(),
    provinceName: z.string().trim().optional(),
    note: z.string().trim().optional(),
  });

  return partyFormSchema;
}
export type PartyFormInput = z.input<ReturnType<typeof createPartyFormSchema>>;
export type PartyFormValues = z.output<ReturnType<typeof createPartyFormSchema>>;

export type PartyFormInitialValues = Partial<PartyFormInput>;
