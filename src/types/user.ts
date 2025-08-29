// src/types/user.ts
import type { Types } from 'mongoose';
export type UserRole = 'user' | 'admin' | 'moderator';
export type Gender = 'male' | 'female' | 'unknown';

export type AgeRange = '13-17' | '18-24' | '25-34' | '35-44' | '45+';

export interface UserDoc {
  _id: Types.ObjectId;
  uid: string;
  phone: string;
  displayName?: string;
  username?: string;
  roles: UserRole[];
  gender: Gender;
  ageRange?: AgeRange;
  createdAt: Date;
  updatedAt: Date;
}
