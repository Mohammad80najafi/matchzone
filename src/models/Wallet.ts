import { Schema, model, models } from 'mongoose';

export type WalletDoc = {
  userId: string; // UID ما
  balance: number; // موجودی قابل برداشت (ریال)
  hold: number; // مبالغ بلوکه شده (Escrow)
  updatedAt: Date;
  createdAt: Date;
};

const WalletSchema = new Schema<WalletDoc>(
  {
    userId: { type: String, unique: true, index: true },
    balance: { type: Number, default: 0 },
    hold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const WalletModel =
  models.Wallet || model<WalletDoc>('Wallet', WalletSchema);
