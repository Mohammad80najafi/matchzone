'use server';

import { connectDB } from '@/lib/db';
import { UserModel } from '@/models/User';
import { ensureUserId } from '@/lib/session';
import type { AgeRange } from '@/types/age';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function setAgeRange(formData: FormData) {
  const uid = await ensureUserId();
  const ageRange = String(formData.get('ageRange') || '') as AgeRange;

  await connectDB();
  await UserModel.updateOne({ uid }, { $set: { ageRange } }, { upsert: true });

  revalidatePath('/profile');
  redirect('/profile?age=1');
}
