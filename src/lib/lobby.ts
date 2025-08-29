export function generateLobbyCode() {
  // MZ-XXXXXX (A-Z0-9 بدون حروف گیج کننده)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return `MZ-${s}`;
}

export const GAME_CAPACITY: Record<string, number> = {
  CS2: 5,
  'COD Mobile': 4,
  'PUBG Mobile': 4,
  'Mobile Legends': 5,
};
