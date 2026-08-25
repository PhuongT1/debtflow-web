import { z } from "zod";
import { PartyType } from "@/lib/domain";
import { optionalQueryEnum, optionalQueryValue } from "@/lib/query-schema";

export const partySchema = z.object({
  type: z.nativeEnum(PartyType),
  code: z.string().trim().optional().nullable(),
  name: z.string().trim().min(1, "Tên là bắt buộc"),
  phone: z.string().trim().optional().nullable(),
  email: z.string().trim().email("Email không hợp lệ").optional().or(z.literal("")).nullable(),
  taxCode: z.string().trim().optional().nullable(),
  address: z.string().trim().optional().nullable(),
  note: z.string().trim().optional().nullable(),
  creditLimit: z.coerce.number().nonnegative().optional().nullable(),
  assignedToId: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const partyQuerySchema = z.object({
  q: optionalQueryValue(z.string()),
  type: optionalQueryEnum(z.nativeEnum(PartyType)),
  assignedToId: optionalQueryValue(z.string()),
  createdRange: optionalQueryValue(z.enum(["today", "last_7_days", "this_month"])),
  createdFrom: optionalQueryValue(z.string()),
  createdTo: optionalQueryValue(z.string()),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
