declare module "smsir-js" {
  // بدنه‌ی خیلی مینیمال و تایپ‌سیف برای نیاز ما
  export interface VerifyParam {
    name: string;
    value: string | number;
  }

  export interface VerifyPayload {
    mobile: string;
    templateId: number;
    parameters: VerifyParam[];
  }

  class Smsir {
    constructor(api_key: string, line_number: number);
    sendVerifyCode(payload: VerifyPayload): Promise<any>;
  }

  // هم default و هم named export را برای راحتی ساپورت کنیم
  export default Smsir;
  export { Smsir };
}
