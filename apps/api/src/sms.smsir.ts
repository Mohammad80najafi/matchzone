import type { SmsProvider } from "./sms";
import Smsir from "smsir-js";

export type SmsIrJsConfig = {
  apiKey: string;
  lineNumber: number;
  templateId: number; // قالب VERIFY با پارامتر Code
};

export class SmsIrJsProvider implements SmsProvider {
  private readonly client: Smsir;
  private readonly templateId: number;

  constructor(cfg: SmsIrJsConfig) {
    this.client = new Smsir(cfg.apiKey, cfg.lineNumber);
    this.templateId = cfg.templateId;
  }

  async sendOtp(phone: string, code: string): Promise<void> {
    const res = await this.client.sendVerifyCode({
      mobile: phone,
      templateId: this.templateId,
      parameters: [{ name: "Code", value: code }],
    });
    // برای اطمینان یک لاگ سبک (اختیاری)
    // console.log("[smsir-js] response:", res);
  }
}
