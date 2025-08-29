import type { AgeRange, LobbyGenderConstraint } from './common';

export type GameType = 'CS2' | 'COD Mobile' | 'PUBG Mobile' | 'Mobile Legends';
export type LobbyType = 'عمومی' | 'خصوصی';
export type LobbyStatus = 'open' | 'started' | 'full' | 'expired' | 'closed';

export interface LobbyDoc {
  _id?: string;
  code: string;

  title: string;
  game: GameType;
  type: LobbyType;

  // محدودیت‌ها
  ageRange: AgeRange;
  genderConstraint: LobbyGenderConstraint; // 'any' | 'male' | 'female'

  // ظرفیت/اعضا
  max: number;
  players: number;
  ownerId: string;
  members: string[]; // ✅ فقط uid ها

  // مالی
  isPaid: boolean;
  entryFee: number; // ریال

  // توضیحات
  description?: string;

  // تایمر
  durationMins: number;
  startedAt?: Date;
  expiresAt?: Date;

  status: LobbyStatus;

  createdAt: Date;
  updatedAt?: Date;
}
