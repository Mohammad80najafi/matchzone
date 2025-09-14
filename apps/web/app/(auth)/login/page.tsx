"use client";
import { useState } from "react";
import { tokens } from "@matchzone/ui/theme/tokens";
import { Input } from "@matchzone/ui/atoms/Input";
import { Button } from "@matchzone/ui/atoms/Button";

function normalizePhone(input: string): string {
  // تبدیل اعداد فارسی/عربی به لاتین و حذف فاصله و +98 → 09
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  let s = input.trim();
  // تبدیل اعداد
  s = s.replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)));
  s = s.replace(/[٠-٩]/g, (d) => String(ar.indexOf(d)));
  // حذف هرچیز غیر عدد
  s = s.replace(/\D+/g, "");
  // نرمال +98
  if (s.startsWith("98") && s.length === 12) s = "0" + s.slice(2);
  return s;
}

async function requestOtp(rawPhone: string): Promise<string | null> {
  console.log("requestOtp", rawPhone);
  const phone = normalizePhone(rawPhone);
  if (!/^09\d{9}$/.test(phone)) return "شماره موبایل نامعتبر است";
  try {
    const res = await fetch("http://localhost:4000/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      try {
        const d = await res.json();
        return d?.error ?? "خطای ناشناخته";
      } catch {
        return "خطای سرور";
      }
    }
    return null;
  } catch {
    return "عدم اتصال به API";
  }
}

async function verifyOtp(
  phone: string,
  code: string
): Promise<{ error?: string; token?: string }> {
  if (!/^\d{5}$/.test(code)) return { error: "کد ۵ رقمی نامعتبر است" };
  try {
    const res = await fetch("http://localhost:4000/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) {
      try {
        const d = await res.json();
        return { error: d?.error ?? "خطای ناشناخته" };
      } catch {
        return { error: "خطای سرور" };
      }
    }
    const data = await res.json();
    return { token: data.token };
  } catch {
    return { error: "عدم اتصال به API" };
  }
}

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: tokens.color.bg.base,
        color: tokens.color.text.primary,
        display: "grid",
        placeItems: "center",
        padding: 24,
      }}>
      <section style={{ width: 360, display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>ورود</h1>
        {step === "phone" ? (
          <>
            <label htmlFor="phone">شماره موبایل</label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09xxxxxxxxx یا 098xxxxxxxxx"
              type="tel"
            />
            <Button
              label="ارسwedfwال کد"
              onClick={async () => {
                console.log("requestOtp", phone);
                setError(null);
                const err = await requestOtp(phone);
                if (err) setError(err);
                else setStep("otp");
              }}
            />
          </>
        ) : (
          <>
            <label htmlFor="code">کد ۵ رقمی</label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="xxxxx"
              type="tel"
            />
            <Button
              label="تأیید"
              onClick={async () => {
                setError(null);
                const res = await verifyOtp(phone, code);
                if (res.error) {
                  setError(res.error);
                  return;
                }
                // ست کردن کوکی سمت کلاینت امکان‌پذیر نیست (HttpOnly). پس به صفحه ی /auth/callback می‌رویم با توکن در hash
                window.location.href = `/auth/callback#token=${res.token}`;
              }}
            />
          </>
        )}
        {error ? <p style={{ color: tokens.color.danger }}>{error}</p> : null}
      </section>
    </main>
  );
}
