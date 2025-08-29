import { Schema, model, models, Types } from 'mongoose';

export type TxStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface ITransaction {
  _id: Types.ObjectId;
  lobbyId: Types.ObjectId;
  buyerId: Types.ObjectId;
  amountToman: number;
  status: TxStatus;
  gatewayRef?: string;
  createdAt: Date;
  updatedAt: Date;
}

const txSchema = new Schema<ITransaction>(
  {
    lobbyId: {
      type: Schema.Types.ObjectId,
      ref: 'Lobby',
      required: true,
      index: true,
    },
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amountToman: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    gatewayRef: String,
  },
  { timestamps: true }
);

txSchema.index({ buyerId: 1, status: 1, createdAt: -1 });

export const Transaction =
  models.Transaction || model<ITransaction>('Transaction', txSchema);


// Backward compatible alias
export const TransactionModel = Transaction;
export type TransactionDoc = ITransaction;
