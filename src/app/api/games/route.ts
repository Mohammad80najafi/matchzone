// app/api/games/route.ts
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';
import { Game } from '@/models/Game';

export async function GET() {
  await connectToDB();
  const games = await Game.find().lean();
  return NextResponse.json({ games });
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const { key, name, platforms } = await req.json();
  const created = await Game.create({ key, name, platforms });
  return NextResponse.json({ game: created }, { status: 201 });
}
