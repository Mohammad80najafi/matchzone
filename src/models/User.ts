import { Schema, model, models, type Types } from 'mongoose';

export type Gender = 'male' | 'female' | 'other';
export interface IUser {
  _id: Types.ObjectId;
  username: string;
  displayName: string;
  phone?: string;
  avatarUrl?: string;
  country?: string; // "IR"
  gender?: Gender;
  ageRange?: string; // e.g. "18-24"
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true, index: true },
    avatarUrl: String,
    country: { type: String, default: 'IR', index: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: undefined },
    ageRange: { type: String, default: undefined },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>('User', userSchema);

// Backward compatible alias
export const UserModel = User;
export type UserDoc = IUser;
