// app/api/lobbies/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { Lobby } from '@/models/Lobby';
import { createLobbySchema, listLobbiesQuerySchema } from '@/schemas/lobby';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  await connectToDB();
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rl = rateLimit(`GET:/lobbies:${ip}`, 120, 60_000);
  if (!rl.ok)
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const url = new URL(req.url);
  const parsed = listLobbiesQuerySchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );

  const { gameId, q, maxPrice, openOnly, limit, cursor } = parsed.data;

  const filter: Record<string, unknown> = {};
  if (gameId) filter.gameId = gameId;
  if (openOnly) filter.isOpen = true;
  if (typeof maxPrice === 'number') filter.priceToman = { $lte: maxPrice };
  if (q && q.trim()) filter.$text = { $search: q.trim() };

  const findQuery = Lobby.find(filter).sort({ _id: -1 }).limit(limit);
  if (cursor) findQuery.where({ _id: { $lt: cursor } });

  const lobbies = await findQuery.lean();
  const nextCursor =
    lobbies.length === limit ? String(lobbies[lobbies.length - 1]._id) : null;

  return NextResponse.json({ lobbies, nextCursor });
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const rl = rateLimit(`POST:/lobbies:${ip}`, 20, 60_000);
  if (!rl.ok)
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const json = await req.json();
  const parsed = createLobbySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );

  const lobby = await Lobby.create(parsed.data);
  return NextResponse.json({ lobby }, { status: 201 });
}
