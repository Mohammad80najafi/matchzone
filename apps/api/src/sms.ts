export interface SmsProvider {
  sendOtp: (phone: string, code: string) => Promise<void>;
}

export class ConsoleSmsProvider implements SmsProvider {
  async sendOtp(phone: string, code: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`[SMS][DEV] to:${phone} code:${code}`);
  }
}
