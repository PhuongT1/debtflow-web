import { z } from "zod";

const partnerOpsEnvSchema = z.object({
  CORE_APP_ORIGIN: z.string().url().default("http://localhost:3000"),
  PUBLIC_APP_ORIGIN: z.string().url().default("http://localhost:3000"),
  PARTNER_OPS_ASSET_PREFIX: z
    .string()
    .regex(/^\/[a-z0-9][a-z0-9/_-]*$/, "PARTNER_OPS_ASSET_PREFIX must be an absolute URL path")
    .default("/partner-ops-static"),
  DEPLOYMENT_VERSION: z.string().min(1).default("development"),
});

export const partnerOpsEnv = partnerOpsEnvSchema.parse({
  CORE_APP_ORIGIN: process.env.CORE_APP_ORIGIN,
  PUBLIC_APP_ORIGIN: process.env.PUBLIC_APP_ORIGIN,
  PARTNER_OPS_ASSET_PREFIX: process.env.PARTNER_OPS_ASSET_PREFIX,
  DEPLOYMENT_VERSION:
    process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.DEPLOYMENT_VERSION,
});
