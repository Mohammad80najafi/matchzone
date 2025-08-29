// scripts/sync-indexes.ts
import { connectToDB } from '@/lib/db';
import { Session } from '@/models/Session';

(async () => {
  await connectToDB();
  await Session.syncIndexes();
  console.log('Indexes synced ✔');
  process.exit(0);
})();
