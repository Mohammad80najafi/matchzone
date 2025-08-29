import { Schema, model, models, type Types } from 'mongoose';

export type LobbyStatus = 'open' | 'full' | 'started' | 'expired' | 'closed';
export type LobbyType = 'public' | 'private';
export type GenderConstraint = 'any' | 'male' | 'female';

export interface ILobby {
  _id: Types.ObjectId;
  code: string;
  title: string;
  game: string;
  type: LobbyType;
  status: LobbyStatus;
  ownerId: string;
  members: string[];
  players: number;
  max: number;
  genderConstraint: GenderConstraint;
  isPaid: boolean;
  entryFee: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const lobbySchema = new Schema<ILobby>(
  {
    code: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    game: { type: String, required: true, index: true },
    type: { type: String, enum: ['public', 'private'], default: 'public', index: true },
    status: { type: String, enum: ['open', 'full', 'started', 'expired', 'closed'], default: 'open', index: true },
    ownerId: { type: String, required: true, index: true },
    members: { type: [String], default: [] },
    players: { type: Number, default: 0 },
    max: { type: Number, default: 4 },
    genderConstraint: { type: String, enum: ['any', 'male', 'female'], default: 'any' },
    isPaid: { type: Boolean, default: false },
    entryFee: { type: Number, default: 0 },
    expiresAt: { type: Date, default: undefined },
  },
  { timestamps: true }
);

export const Lobby = models.Lobby || model<ILobby>('Lobby', lobbySchema);
export const LobbyModel = Lobby;
export type LobbyDoc = ILobby;
