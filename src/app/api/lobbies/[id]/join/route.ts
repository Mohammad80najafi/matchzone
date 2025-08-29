export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { Lobby } from '@/models/Lobby';
import { LobbyMember } from '@/models/LobbyMember';
import { ensureUserId } from '@/lib/session';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDB();
  const { id: lobbyId } = await context.params;
  const userId = await ensureUserId();

  const lobby = await Lobby.findById(lobbyId);
  if (!lobby) return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });

  const memberCount = await LobbyMember.countDocuments({ lobbyId });
  if (memberCount >= lobby.capacity)
    return NextResponse.json({ error: 'Lobby is full' }, { status: 400 });

  const joined = await LobbyMember.findOneAndUpdate(
    { lobbyId, userId },
    {
      $setOnInsert: {
        role: lobby.hostId.equals(userId) ? 'host' : 'member',
        joinedAt: new Date(),
      },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ member: joined }, { status: 201 });
}
