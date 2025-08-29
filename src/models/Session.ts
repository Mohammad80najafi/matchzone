import { Schema, model, models, type Types } from 'mongoose';

export interface ISession {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: 'User',
    },
    token: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// ⛔ این دو خط را حذف کن تا Warning رفع شود:
// sessionSchema.index({ token: 1 });
// sessionSchema.index({ expiresAt: 1 });

export const Session =
  models.Session || model<ISession>('Session', sessionSchema);
