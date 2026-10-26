import { z } from 'zod';

export function createPartyFilterSchema(invalidDateRangeMessage: string) {
  return z
    .object({
      q: z.string(),
      type: z.string(),
      assignedToId: z.string(),
      balanceType: z.string(),
      createdFrom: z.string(),
      createdTo: z.string(),
    })
    .refine(
      (values) =>
        !values.createdFrom || !values.createdTo || values.createdFrom <= values.createdTo,
      {
        message: invalidDateRangeMessage,
        path: ['createdTo'],
      },
    );
}

export type PartyFilterValues = z.infer<ReturnType<typeof createPartyFilterSchema>>;
