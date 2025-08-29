'use server';

import { connectDB } from '@/lib/db';
import { LobbyModel, type LobbyDoc } from '@/models/Lobby';
import { UserModel, type UserDoc } from '@/models/User';
import { ensureUserId } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function s(v: unknown) {
  return String(v ?? '').trim();
}
function asMemberIds(m: LobbyDoc['members'] | undefined): string[] {
  return Array.isArray(m) ? (m as string[]) : [];
}
function playersOf(l: LobbyDoc) {
  return Number(l.players ?? 0);
}

export async function joinLobby(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const uid = await ensureUserId();
  if (!code) redirect(`/lobbies/${code}?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/lobbies/${code}?error=notfound`);

  if (lobby.status === 'started') redirect(`/lobbies/${code}?error=started`);

  // gender gate
  if (lobby.genderConstraint !== 'any') {
    const user = await UserModel.findOne({ uid }, { gender: 1 }).lean<Pick<
      UserDoc,
      'gender'
    > | null>();
    const g = user?.gender ?? 'unknown';
    let ok = false;
    switch (lobby.genderConstraint) {
      case 'male':
        ok = g === 'male';
        break;
      case 'female':
        ok = g === 'female';
        break;
      default:
        ok = true;
    }
    if (!ok) redirect(`/lobbies/${code}?error=gender_restricted`);
  }

  const members = asMemberIds(lobby.members);
  const cur = playersOf(lobby);
  const max = Number(lobby.max ?? 0);

  if (cur >= max || lobby.status === 'full') {
    await LobbyModel.updateOne({ code }, { $set: { status: 'full' } });
    redirect(`/lobbies/${code}?error=full`);
  }

  if (members.includes(uid)) redirect(`/lobbies/${code}?joined=1`);

  const newPlayers = cur + 1;
  await LobbyModel.updateOne(
    { code },
    {
      $addToSet: { members: uid },
      $inc: { players: 1 },
      $set: { status: newPlayers >= max ? 'full' : 'open' },
    }
  );

  revalidatePath(`/lobbies/${code}`);
  redirect(`/lobbies/${code}?joined=1`);
}

export async function leaveLobby(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const uid = await ensureUserId();
  if (!code) redirect(`/lobbies/${code}?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/lobbies/${code}?error=notfound`);

  const members = asMemberIds(lobby.members);
  if (!members.includes(uid)) redirect(`/lobbies/${code}?error=not_member`);

  const newMembers = members.filter((m) => m !== uid);
  const newPlayers = Math.max(0, playersOf(lobby) - 1);
  const max = Number(lobby.max ?? 0);
  const newOwner =
    lobby.ownerId === uid ? (newMembers[0] ?? lobby.ownerId) : lobby.ownerId;

  await LobbyModel.updateOne(
    { code },
    {
      $set: {
        members: newMembers,
        players: newPlayers,
        ownerId: newOwner,
        status: newPlayers >= max ? 'full' : 'open',
      },
    }
  );

  revalidatePath(`/lobbies/${code}`);
  redirect(`/lobbies/${code}?left=1`);
}

export async function startLobby(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const uid = await ensureUserId();
  if (!code) redirect(`/lobbies/${code}?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/lobbies/${code}?error=notfound`);
  if (lobby.ownerId !== uid) redirect(`/lobbies/${code}?error=forbidden`);

  await LobbyModel.updateOne(
    { code },
    { $set: { status: 'started', startedAt: new Date() } }
  );

  revalidatePath(`/lobbies/${code}`);
  redirect(`/lobbies/${code}?started=1`);
}

export async function closeLobby(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const uid = await ensureUserId();
  if (!code) redirect(`/lobbies/${code}?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/lobbies/${code}?error=notfound`);
  if (lobby.ownerId !== uid) redirect(`/lobbies/${code}?error=forbidden`);

  await LobbyModel.updateOne({ code }, { $set: { status: 'open' } });

  revalidatePath(`/lobbies/${code}`);
  redirect(`/lobbies/${code}?closed=1`);
}

export async function deleteLobby(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const uid = await ensureUserId();
  if (!code) redirect(`/profile?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/profile?error=notfound`);
  if (lobby.ownerId !== uid) redirect(`/lobbies/${code}?error=forbidden`);

  await LobbyModel.deleteOne({ code });

  revalidatePath('/profile');
  redirect('/profile?deleted=1');
}

export async function removeMember(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const targetUid = s(formData.get('uid'));
  const uid = await ensureUserId();

  if (!code || !targetUid) redirect(`/lobbies/${code}?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/lobbies/${code}?error=notfound`);
  if (lobby.ownerId !== uid) redirect(`/lobbies/${code}?error=forbidden`);

  const members = asMemberIds(lobby.members);
  const wasMember = members.includes(targetUid);
  const newMembers = wasMember
    ? members.filter((m) => m !== targetUid)
    : members;
  const newPlayers = Math.max(0, playersOf(lobby) - (wasMember ? 1 : 0));
  const max = Number(lobby.max ?? 0);

  await LobbyModel.updateOne(
    { code },
    {
      $set: {
        members: newMembers,
        players: newPlayers,
        status: newPlayers >= max ? 'full' : 'open',
      },
    }
  );

  revalidatePath(`/lobbies/${code}`);
  redirect(`/lobbies/${code}?kick=1`);
}

export async function transferOwnership(formData: FormData): Promise<void> {
  const code = s(formData.get('code'));
  const targetUid = s(formData.get('uid'));
  const uid = await ensureUserId();

  if (!code || !targetUid) redirect(`/lobbies/${code}?error=notfound`);

  await connectDB();
  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) redirect(`/lobbies/${code}?error=notfound`);
  if (lobby.ownerId !== uid) redirect(`/lobbies/${code}?error=forbidden`);

  const members = asMemberIds(lobby.members);
  if (!members.includes(targetUid) || targetUid === uid) {
    redirect(`/lobbies/${code}?error=bad_target`);
  }

  await LobbyModel.updateOne({ code }, { $set: { ownerId: targetUid } });

  revalidatePath(`/lobbies/${code}`);
  redirect(`/lobbies/${code}?owner_changed=1`);
}
