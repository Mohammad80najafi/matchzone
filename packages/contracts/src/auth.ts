import { z } from "zod";

export const PhoneSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "فرمت شماره معتبر نیست")
});
export type PhoneInput = z.infer<typeof PhoneSchema>;

export const OtpSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/),
  code: z.string().length(5, "کد 5 رقمی").regex(/^\d+$/, "فقط عدد")
});
export type OtpInput = z.infer<typeof OtpSchema>;

export const VerifyResponseSchema = z.object({
  token: z.string().min(16)
});
export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;
