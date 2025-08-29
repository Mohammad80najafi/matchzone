export function normalizeIranPhone(input: string): string {
  const digits = input.replace(/[^\d]/g, '');
  // Acceptable: 09XXXXXXXXX or 9XXXXXXXXX or +989XXXXXXXXX or 00989XXXXXXXXX
  let normalized = digits;
  if (digits.startsWith('0098')) normalized = digits.slice(4);
  else if (digits.startsWith('98')) normalized = digits.slice(2);
  else if (digits.startsWith('0')) normalized = digits.slice(1);
  // Now should start with 9 and be 10 digits (9XXXXXXXXX)
  if (!/^9\d{9}$/.test(normalized)) {
    throw new Error('شماره موبایل معتبر نیست');
  }
  return '+98' + normalized;
}
