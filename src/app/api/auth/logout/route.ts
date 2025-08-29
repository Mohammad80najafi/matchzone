export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { Session } from '@/models/Session';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'mz_session';

export async function POST() {
  await connectToDB();
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (token) {
    await Session.deleteOne({ token });
    jar.set(COOKIE_NAME, '', { expires: new Date(0), httpOnly: true, path: '/' });
  }
  return NextResponse.json({ ok: true });
}
