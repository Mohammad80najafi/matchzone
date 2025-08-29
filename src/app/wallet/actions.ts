'use server';

import { revalidatePath } from 'next/cache';
import { getUserIdSafe } from '@/lib/session';
import { credit } from '@/lib/wallet';
import { TransactionModel } from '@/models/Transaction';
import { connectDB } from '@/lib/db';

/** فقط نمونه MVP – درگاه واقعی را در مراحل بعد وصل می‌کنیم */
export async function depositDemo(formData: FormData) {
  const uid = await getUserIdSafe();
  const amount = Number(formData.get('amount') || 0) * 10; // تبدیل تومان به ریال اگر ورودی تومان بود
  if (amount <= 0) throw new Error('Amount invalid');
  await credit(uid!, amount, { type: 'deposit', description: 'DEMO' });
  revalidatePath('/profile?tab=wallet');
}

export async function withdrawRequest(formData: FormData) {
  const uid = await getUserIdSafe();
  const amount = Number(formData.get('amount') || 0) * 10;
  if (amount <= 0) throw new Error('Amount invalid');

  // در MVP فقط تراکنش ثبت می‌کنیم و ادمین دستی پرداخت می‌کند
  await connectDB();
  await TransactionModel.create({
    userId: uid!,
    type: 'withdraw',
    amount: -amount,
    status: 'pending',
    description: 'WITHDRAW_REQUEST',
  });

  // ادمین بعداً تایید کرد => credit/debit اعمال می‌کنیم (یا پرداخت شبا)
  revalidatePath('/profile?tab=wallet');
}
