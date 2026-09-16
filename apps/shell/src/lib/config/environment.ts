import { z } from 'zod';

const shellEnvSchema = z.object({
  API_BASE_URL: z.string().url().default('http://localhost:4000/api'),
  AUTH_URL: z.string().url().default('http://localhost:3000'),
  AUTH_ALLOWED_RETURN_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3001,http://localhost:3002'),
  MFE_MANIFEST_PATH: z.string().min(1).optional(),
});

export const shellEnv = shellEnvSchema.parse({
  API_BASE_URL: process.env.API_BASE_URL,
  AUTH_URL: process.env.AUTH_URL,
  AUTH_ALLOWED_RETURN_ORIGINS: process.env.AUTH_ALLOWED_RETURN_ORIGINS,
  MFE_MANIFEST_PATH: process.env.MFE_MANIFEST_PATH || undefined,
});

export const API_URL = shellEnv.API_BASE_URL;
