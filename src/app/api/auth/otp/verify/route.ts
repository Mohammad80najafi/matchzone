export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { OtpModel, type IOtp } from '@/models/Otp';
import { User, type IUser } from '@/models/User';
import { verifyOtpSchema } from '@/schemas/auth';
import { createSession, setSessionCookie } from '@/lib/session';

function usernameFromPhone(phone: string): string {
  const tail = phone.slice(-6);
  return `mz_${tail}`;
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const parsed = verifyOtpSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { phone, code } = parsed.data;

  const rec = await OtpModel.findOne({ phone, purpose: 'login', used: false })
    .sort({ createdAt: -1 })
    .lean<IOtp | null>();

  if (!rec || rec.expiresAt < new Date() || rec.code !== code) {
    return NextResponse.json({ error: 'کد نامعتبر یا منقضی است' }, { status: 400 });
  }

  await OtpModel.updateMany({ _id: rec._id }, { $set: { used: true } });

  let user = await User.findOne({ phone }).lean<IUser | null>();
  if (!user) {
    const created = await User.create({
      username: usernameFromPhone(phone),
      displayName: usernameFromPhone(phone),
      phone,
      country: 'IR',
    });
    user = created.toObject() as IUser;
  }

  // At this point user is guaranteed
  const s = await createSession(String(user._id));
  const res = NextResponse.json({ ok: true, user: { id: String(user._id), username: user.username } });
  await setSessionCookie(s.token, s.expiresAt);
  return res;
}
