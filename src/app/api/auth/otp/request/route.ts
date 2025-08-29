export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { OtpModel } from '@/models/Otp';
import { rateLimit } from '@/lib/rateLimit';
import { requestOtpSchema } from '@/schemas/auth';

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6-digit
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rl = rateLimit(`POST:/auth/otp/request:${ip}`, 5, 60_000);
  if (!rl.ok) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json();
  const parsed = requestOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { phone } = parsed.data;

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await OtpModel.create({
    phone,
    code,
    purpose: 'login',
    expiresAt,
  });

  // TODO: Integrate real SMS provider. For dev:
  console.log('[DEV-OTP]', phone, code);

  return NextResponse.json({ ok: true, expiresAt });
}
