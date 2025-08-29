import { Schema, model, models, Types } from 'mongoose';

export interface IGame {
  _id: Types.ObjectId;
  key: 'codm' | 'pubgm' | 'mlbb' | 'cs2';
  name: string;
  platforms: string[]; // e.g. ["android","ios","pc"]
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema = new Schema<IGame>(
  {
    key: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    platforms: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Game = models.Game || model<IGame>('Game', gameSchema);
