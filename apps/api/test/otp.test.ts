import { describe, it, expect } from "vitest";
import { buildApp } from "../src/app";
import { MemoryKVStore } from "../src/kv.memory";

describe("OTP flow", () => {
  it("should request and verify OTP, then return session token", async () => {
    const kv = new MemoryKVStore();
    const app = buildApp(kv, "http://localhost:3000");

    const phone = "09123456789";

    const req1 = await app.inject({
      method: "POST",
      url: "/auth/request-otp",
      payload: { phone }
    });
    expect(req1.statusCode).toBe(200);
    const stored = await kv.get(`otp:${phone}`);
    expect(stored).not.toBeNull();
    const code = stored as string;

    const req2 = await app.inject({
      method: "POST",
      url: "/auth/verify-otp",
      payload: { phone, code }
    });
    expect(req2.statusCode).toBe(200);
    const body = req2.json() as { token: string };
    expect(typeof body.token).toBe("string");
    expect(body.token.length).toBeGreaterThanOrEqual(16);
  });

  it("should reject wrong or expired code", async () => {
    const kv = new MemoryKVStore();
    const app = buildApp(kv, "http://localhost:3000");
    const phone = "09123456789";

    await app.inject({ method: "POST", url: "/auth/request-otp", payload: { phone } });
    const res = await app.inject({
      method: "POST",
      url: "/auth/verify-otp",
      payload: { phone, code: "00000" }
    });
    expect(res.statusCode).toBe(400);
  });
});
