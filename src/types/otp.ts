// src/types/otp.ts

/**
 * سناریو/هدف OTP
 * - login: ورود با شماره موبایل
 * - change_phone: تغییر شماره موبایل کاربر
 * - payout: تأیید برداشت/تسویه (در صورت نیاز آینده)
 */
export type OtpPurpose = 'login' | 'change_phone' | 'payout';

/**
 * شکل داده‌ی OTP که در سراسر لایه‌ها (مدل/سرویس/روت) از آن استفاده می‌کنیم.
 * اگر از .lean() استفاده کنی، دقیقا همین شکل برای تایپ مناسب است.
 */
export interface OtpDoc {
  /** شماره موبایل به صورت E.164 یا فرمت داخلی پروژه (مثلاً 09xxxxxxxxx) */
  phone: string;

  /** کد ۶ رقمی یا دلخواه که برای اعتبارسنجی ارسال می‌شود */
  code: string;

  /** هدف/سناریوی صدور OTP */
  purpose: OtpPurpose;

  /** آیا این کد مصرف شده است؟ */
  used: boolean;

  /** تعداد دفعات تلاش ناموفق برای این کد */
  attempts: number;

  /** زمان انقضا */
  expiresAt: Date;

  /** زمان ایجاد رکورد (اگر schema دارای timestamps باشد) */
  createdAt?: Date;

  /** زمان به‌روزرسانی رکورد (اگر schema دارای timestamps باشد) */
  updatedAt?: Date;

  /**
   * شناسه رکورد؛ در خروجی‌های .lean() معمولا string است.
   * اگر جایی ObjectId لازم شد، می‌توانی در مدل Mongoose از Types.ObjectId استفاده کنی،
   * ولی در سطح types پروژه، string کفایت می‌کند.
   */
  _id?: string;
}

/**
 * ورودی ساخت OTP (برای Service/Action ها)
 */
export type CreateOtpInput = Pick<
  OtpDoc,
  'phone' | 'code' | 'purpose' | 'expiresAt'
> & {
  used?: boolean;
  attempts?: number;
};

/**
 * ورودی اعتبارسنجی/بررسی OTP
 */
export interface VerifyOtpInput {
  phone: string;
  code: string;
  purpose?: OtpPurpose; // اگر برای سناریوی خاص چک می‌کنی
}
