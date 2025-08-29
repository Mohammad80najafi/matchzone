// src/types/enums.ts
export type Gender = 'any' | 'male' | 'female';

export const GENDER_OPTIONS: Array<{ value: Gender; label: string }> = [
  { value: 'any', label: 'مختلط / اهمیتی ندارد' },
  { value: 'male', label: 'فقط آقایان' },
  { value: 'female', label: 'فقط بانوان' },
];

// اگر قبلاً AgeRange داشتی از همون استفاده کن؛ این نمونه سادست
export type AgeRange = '12-18' | '18-26' | '26-35' | '35+';

export const AGE_OPTIONS: Array<{ value: AgeRange; label: string }> = [
  { value: '12-18', label: '۱۲ تا ۱۸' },
  { value: '18-26', label: '۱۸ تا ۲۶' },
  { value: '26-35', label: '۲۶ تا ۳۵' },
  { value: '35+', label: '۳۵ به بالا' },
];

export type UserRole = 'user' | 'admin' | 'moderator';
