import { z } from "zod";

const shellEnvSchema = z.object({
  API_BASE_URL: z.string().url().default("http://localhost:4000/api"),
  MFE_MANIFEST_PATH: z.string().min(1).optional(),
});

export const shellEnv = shellEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  MFE_MANIFEST_PATH: process.env.MFE_MANIFEST_PATH || undefined,
});

export const API_URL = shellEnv.API_BASE_URL;
