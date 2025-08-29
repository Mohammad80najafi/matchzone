import { cookies } from 'next/headers';
import crypto from 'crypto';
import { Session, type ISession } from '@/models/Session';
import { connectToDB } from '@/lib/db';

const COOKIE_NAME = 'mz_session';

export interface SessionInfo {
  userId: string;
  token: string;
  expiresAt: Date;
}

export async function createSession(userId: string, ttlDays = 30): Promise<SessionInfo> {
  await connectToDB();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  const doc = await Session.create({ userId, token, expiresAt });
  return { userId: String(doc.userId), token: doc.token, expiresAt: doc.expiresAt };
}

export async function getSessionFromCookie(): Promise<SessionInfo | null> {
  await connectToDB();
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const doc = await Session.findOne({ token, expiresAt: { $gt: new Date() } }).lean<ISession | null>();
  if (!doc) return null;
  return { userId: String(doc.userId), token: doc.token, expiresAt: doc.expiresAt };
}

export async function clearSessionCookie() {
  (await cookies()).set(COOKIE_NAME, '', { expires: new Date(0), httpOnly: true, path: '/' });
}

export async function getUserIdSafe(): Promise<string | null> {
  const s = await getSessionFromCookie();
  return s?.userId ?? null;
}

export async function ensureUserId(): Promise<string> {
  const uid = await getUserIdSafe();
  if (!uid) throw new Error('unauthorized');
  return uid;
}

export async function setSessionCookie(token: string, expiresAt: Date) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    expires: expiresAt,
    path: '/',
  });
}
