import { Schema, model, models, type Types } from 'mongoose';

export interface IOtp {
  _id: Types.ObjectId;
  phone: string;         // +98912....
  code: string;          // 6-digit
  purpose: 'login';
  used: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true, index: true },
    code: { type: String, required: true },
    purpose: { type: String, enum: ['login'], default: 'login', index: true },
    used: { type: Boolean, default: false, index: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

otpSchema.index({ phone: 1, createdAt: -1 });

export const OtpModel = models.Otp || model<IOtp>('Otp', otpSchema);
