import { z } from "zod";

const shellEnvSchema = z
  .object({
    API_BASE_URL: z.string().url().default("http://localhost:4000/api"),
    PARTNER_OPS_ENABLED: z.enum(["true", "false"]).default("false"),
    PARTNER_OPS_ORIGIN: z.string().url().optional(),
  })
  .superRefine((env, context) => {
    if (env.PARTNER_OPS_ENABLED === "true" && !env.PARTNER_OPS_ORIGIN) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "PARTNER_OPS_ORIGIN is required when PARTNER_OPS_ENABLED=true",
        path: ["PARTNER_OPS_ORIGIN"],
      });
    }
  });

export const shellEnv = shellEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  PARTNER_OPS_ENABLED: process.env.PARTNER_OPS_ENABLED,
  PARTNER_OPS_ORIGIN: process.env.PARTNER_OPS_ORIGIN || undefined,
});

export const API_URL = shellEnv.API_BASE_URL;
