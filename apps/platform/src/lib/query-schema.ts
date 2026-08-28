import { z } from "zod";

export const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export function optionalQueryEnum(schema: z.ZodTypeAny) {
  return z.preprocess(emptyToUndefined, schema.optional());
}

export function optionalQueryValue<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess(emptyToUndefined, schema.optional());
}
