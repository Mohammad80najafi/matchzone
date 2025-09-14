import Fastify from "fastify";
import cors from "@fastify/cors";
import { z } from "zod";
import type { KVStore } from "./kv";
import { createOTPService } from "./otp";
import { ConsoleSmsProvider } from "./sms";
import { SmsIrJsProvider } from "./sms.smsir";
export function buildApp(
  kv: KVStore,
  corsOrigin: string,
  smsConfig?: {
    apiKey?: string | null;
    templateId?: number | null;
    baseUrl?: string | null;
    testMode?: boolean;
  }
) {
  const app = Fastify({ logger: true });
  app.register(cors, {
    origin: corsOrigin, // از env: http://localhost:3000
    methods: ["GET", "POST", "OPTIONS"],
  });

  app.get("/healthz", async () => ({ ok: true }));
  app.get("/version", async () => ({
    service: "matchzone-api",
    version: "0.3.1",
  }));

  const testMode =
    (process.env.SMS_TEST_MODE ?? "true").toLowerCase() === "true";
  let smsProvider = new ConsoleSmsProvider();

  if (!testMode) {
    const apiKey = (process.env.SMSIR_API_KEY ?? "").trim();
    const lineNumStr = (process.env.SMSIR_LINE_NUMBER ?? "").trim();
    const templateStr = (process.env.SMSIR_TEMPLATE_ID ?? "").trim();

    const lineNumber = Number(lineNumStr);
    const templateId = Number(templateStr);

    if (
      apiKey &&
      Number.isFinite(lineNumber) &&
      lineNumber > 0 &&
      Number.isFinite(templateId) &&
      templateId > 0
    ) {
      smsProvider = new SmsIrJsProvider({ apiKey, lineNumber, templateId });
    } else {
      app.log.warn(
        "SMS TEST OFF but sms.ir config is incomplete → fallback to ConsoleSmsProvider"
      );
    }
  } else {
    app.log.info("SMS_TEST_MODE is true → using ConsoleSmsProvider");
  }

  const otp = createOTPService(kv, smsProvider, testMode);

  const phoneSchema = z.object({ phone: z.string().regex(/^09\d{9}$/) });
  const verifySchema = z.object({
    phone: z.string().regex(/^09\d{9}$/),
    code: z.string().length(5).regex(/^\d+$/),
  });

  const normalizePhone = (s: string): string => {
    const fa = "۰۱۲۳۴۵۶۷۸۹";
    const ar = "٠١٢٣٤٥٦٧٨٩";
    let x = s
      .trim()
      .replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)))
      .replace(/[٠-٩]/g, (d) => String(ar.indexOf(d)))
      .replace(/\D+/g, "");
    if (x.startsWith("98") && x.length === 12) x = "0" + x.slice(2);
    return x;
  };

  app.post("/auth/request-otp", async (req, res) => {
    const body = (req as any).body as { phone?: string };
    const phone = body?.phone ? normalizePhone(body.phone) : "";
    const parsed = phoneSchema.safeParse({ phone });
    if (!parsed.success)
      return res.status(400).send({ error: "شماره معتبر نیست" });
    try {
      await otp.requestCode(parsed.data.phone);
      return { ok: true };
    } catch (e) {
      req.log.error({ err: e }, "request-otp failed");
      return res.status(500).send({ error: "ارسال کد ناموفق بود" });
    }
  });

  app.post("/auth/verify-otp", async (req, res) => {
    const parsed = verifySchema.safeParse((req as any).body);
    if (!parsed.success)
      return res.status(400).send({ error: "اطلاعات نامعتبر" });
    try {
      const token = await otp.verifyCode(parsed.data.phone, parsed.data.code);
      return { token };
    } catch {
      return res.status(400).send({ error: "کد معتبر نیست یا منقضی شده" });
    }
  });

  return app;
}
