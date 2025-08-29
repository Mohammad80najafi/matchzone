'use server';

import { connectDB } from '@/lib/db';
import { LobbyModel } from '@/models/Lobby';
import { ensureUserId } from '@/lib/session';
import { redirect } from 'next/navigation';
import { zCreateLobby } from '@/lib/validators/lobby';

function s(v: unknown) {
  return String(v ?? '').trim();
}

export async function createLobby(formData: FormData) {
  await connectDB();

  // TS-safe without relying on FormData.entries()
  const entries = Array.from(
    formData as unknown as Iterable<[string, FormDataEntryValue]>
  );
  const raw: Record<string, FormDataEntryValue> = Object.fromEntries(entries);
  const data = zCreateLobby.parse({
    title: s(raw.title),
    game: s(raw.game),
    type: s(raw.type),
    max: raw.max,
    isPaid: raw.isPaid === '1' || raw.isPaid === 'true',
    entryFee: raw.entryFee,
    description: s(raw.description),
    ageRange: s(raw.ageRange) || '18-26',
    genderConstraint: s(raw.genderConstraint) || 'any',
    durationMins: raw.durationMins,
  });

  if (!data.isPaid) data.entryFee = 0;

  const ownerId = await ensureUserId();
  const code = `MZ-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  await LobbyModel.create({
    code,
    title: data.title,
    game: data.game,
    type: data.type,
    ageRange: data.ageRange,
    genderConstraint: data.genderConstraint,

    max: data.max,
    players: 1,
    ownerId,
    members: [ownerId], // ✅ فقط uid

    isPaid: data.isPaid,
    entryFee: data.entryFee,
    description: data.description,

    durationMins: data.durationMins,
    status: 'open',
    createdAt: new Date(),
  });

  redirect(`/lobbies/${code}`);
}
