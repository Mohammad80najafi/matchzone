import type { KVStore } from "./kv";
import type { SmsProvider } from "./sms";

export type OTPService = {
  requestCode: (phone: string) => Promise<void>;
  verifyCode: (phone: string, code: string) => Promise<string>; // session token
};

function randomDigits(len: number): string {
  let out = "";
  for (let i = 0; i < len; i++) out += Math.floor(Math.random() * 10).toString();
  return out;
}
function randomToken(): string {
  const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  return bytes.map(b => b.toString(16).padStart(2, "0")).join("");
}

export function createOTPService(kv: KVStore, sms: SmsProvider, testMode: boolean): OTPService {
  const OTP_TTL = 120; // seconds
  const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days
  return {
    async requestCode(phone: string): Promise<void> {
      const code = randomDigits(5);
      await kv.set(`otp:${phone}`, code, OTP_TTL);
      if (!testMode) {
        await sms.sendOtp(phone, code);
      }
    },
    async verifyCode(phone: string, code: string): Promise<string> {
      const stored = await kv.get(`otp:${phone}`);
      if (!stored || stored != code) throw new Error("کد معتبر نیست یا منقضی شده");
      await kv.del(`otp:${phone}`);
      const token = randomToken();
      await kv.set(`session:${token}`, phone, SESSION_TTL);
      return token;
    }
  };
}
