import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('invalidEmail'),
  password: z.string().min(1, 'passwordRequired'),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const demoLoginValues: LoginValues = {
  email: 'owner@anphu-fashion.demo',
  password: 'Demo@123456',
};
