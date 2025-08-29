export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const { username, displayName, phone } = body;
  if (!username || !displayName || !phone) {
    return NextResponse.json({ error: 'اطلاعات ناقص' }, { status: 400 });
  }
  const existing = await User.findOne({ $or: [{ username }, { phone }] }).lean();
  if (existing) {
    return NextResponse.json({ error: 'این نام کاربری یا شماره قبلاً استفاده شده است' }, { status: 400 });
  }
  const created = await User.create({ username, displayName, phone, country: 'IR' });
  return NextResponse.json({ ok: true, user: { id: String(created._id), username: created.username } });
}
