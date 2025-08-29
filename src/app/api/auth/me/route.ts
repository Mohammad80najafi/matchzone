export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { getUserIdSafe } from '@/lib/session';
import { User, type IUser } from '@/models/User';
import { connectToDB } from '@/lib/db';

export async function GET() {
  await connectToDB();
  const uid = await getUserIdSafe();
  if (!uid) return NextResponse.json({ user: null });
  const user = await User.findById(uid).lean<IUser | null>();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: String(user._id), username: user.username, displayName: user.displayName } });
}
