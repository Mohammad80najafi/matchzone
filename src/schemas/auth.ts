import { z } from 'zod';
import { normalizeIranPhone } from '@/lib/phone';

export const phoneSchema = z
  .string()
  .min(10)
  .max(20)
  .transform((val) => normalizeIranPhone(val));

export const requestOtpSchema = z.object({
  phone: phoneSchema,
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().regex(/^\d{6}$/),
});

export type RequestOtpInput = z.infer<typeof requestOtpSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
