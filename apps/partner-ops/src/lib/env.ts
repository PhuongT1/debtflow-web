import { z } from "zod";

const partnerOpsEnvSchema = z.object({
  PLATFORM_ORIGIN: z.string().url().default("http://localhost:3000"),
  PLATFORM_INTERNAL_ORIGIN: z.string().url().optional(),
  PARTNER_OPS_ASSET_PREFIX: z
    .string()
    .regex(/^\/[a-z0-9][a-z0-9/_-]*$/, "PARTNER_OPS_ASSET_PREFIX must be an absolute URL path")
    .default("/partner-ops-static"),
  DEPLOYMENT_VERSION: z.string().min(1).default("development"),
});

const platformOrigin =
  process.env.PLATFORM_ORIGIN ??
  process.env.PLATFORM_PUBLIC_ORIGIN ??
  process.env.CORE_APP_ORIGIN ??
  "http://localhost:3000";

export const partnerOpsEnv = partnerOpsEnvSchema.parse({
  PLATFORM_ORIGIN: platformOrigin,
  PLATFORM_INTERNAL_ORIGIN: process.env.PLATFORM_INTERNAL_ORIGIN ?? platformOrigin,
  PARTNER_OPS_ASSET_PREFIX: process.env.PARTNER_OPS_ASSET_PREFIX,
  DEPLOYMENT_VERSION:
    process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.DEPLOYMENT_VERSION,
});
