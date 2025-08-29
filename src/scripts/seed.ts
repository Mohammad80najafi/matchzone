import 'dotenv/config';
import { connectToDB } from '@/lib/db';
import { Game } from '@/models/Game';
import { User } from '@/models/User';
import { Lobby } from '@/models/Lobby';

async function main() {
  await connectToDB();
  await Game.deleteMany({});
  await User.deleteMany({});
  await Lobby.deleteMany({});

  const games = await Game.insertMany([
    {
      key: 'codm',
      name: 'Call of Duty: Mobile',
      platforms: ['android', 'ios'],
    },
    { key: 'pubgm', name: 'PUBG Mobile', platforms: ['android', 'ios'] },
    { key: 'mlbb', name: 'Mobile Legends', platforms: ['android', 'ios'] },
    { key: 'cs2', name: 'Counter-Strike 2', platforms: ['pc'] },
  ]);

  const [ali] = await User.insertMany([
    { username: 'ali', displayName: 'Ali' },
  ]);

  await Lobby.create({
    gameId: games[0]._id,
    hostId: ali._id,
    title: 'اسکواد ایرانی CODM',
    visibility: 'public',
    capacity: 4,
    priceToman: 0,
    tags: ['noob-friendly', 'mic-on'],
    isOpen: true,
  });

  console.log('Seed done.');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
