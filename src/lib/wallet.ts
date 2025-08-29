import { connectDB } from '@/lib/db';
import { WalletModel, type WalletDoc } from '@/models/Wallet';
import { TransactionModel, type TransactionDoc } from '@/models/Transaction';

type TxKind = 'deposit' | 'withdraw' | 'lobby_entry' | 'prize' | 'refund';
type TxDirection = 'credit' | 'debit';

interface TxRef {
  kind: 'lobby' | 'payment' | 'order' | 'system';
  id: string;
}
interface TxMeta {
  type: TxKind;
  ref?: TxRef;
  description?: string;
}

export async function ensureWallet(uid: string): Promise<WalletDoc> {
  await connectDB();
  const found = await WalletModel.findOne({ uid }).lean<WalletDoc | null>();
  if (found)
    return (await WalletModel.findOne({ uid })) as unknown as WalletDoc; // یا اگر lean لازم نیست، مستقیم مدل برگردون
  const created = await WalletModel.create({ uid, balance: 0 });
  return created.toObject() as WalletDoc;
}

async function persistTx(
  uid: string,
  amount: number,
  direction: TxDirection,
  meta?: TxMeta
): Promise<TransactionDoc> {
  const tx = await TransactionModel.create({
    uid,
    amount,
    direction,
    meta: meta ?? {},
    createdAt: new Date(),
  });
  return tx.toObject() as TransactionDoc;
}

export async function credit(
  uid: string,
  amount: number,
  meta?: TxMeta
): Promise<WalletDoc> {
  await connectDB();
  const w = await WalletModel.findOneAndUpdate(
    { uid },
    { $inc: { balance: amount } },
    { upsert: true, new: true }
  );
  await persistTx(uid, amount, 'credit', meta);
  return w!.toObject() as WalletDoc;
}

export async function debit(
  uid: string,
  amount: number,
  meta?: TxMeta
): Promise<WalletDoc> {
  await connectDB();
  const w = await WalletModel.findOne({ uid });
  if (!w) throw new Error('wallet_not_found');
  if (w.balance < amount) throw new Error('insufficient_funds');

  w.balance -= amount;
  await w.save();
  await persistTx(uid, amount, 'debit', meta);
  return w.toObject() as WalletDoc;
}
