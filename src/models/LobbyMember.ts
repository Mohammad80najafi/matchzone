import { Schema, model, models, Types } from 'mongoose';

export interface ILobbyMember {
  _id: Types.ObjectId;
  lobbyId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'host' | 'member';
  joinedAt: Date;
}

const lobbyMemberSchema = new Schema<ILobbyMember>(
  {
    lobbyId: {
      type: Schema.Types.ObjectId,
      ref: 'Lobby',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: { type: String, enum: ['host', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

lobbyMemberSchema.index({ lobbyId: 1, userId: 1 }, { unique: true });

export const LobbyMember =
  models.LobbyMember || model<ILobbyMember>('LobbyMember', lobbyMemberSchema);
