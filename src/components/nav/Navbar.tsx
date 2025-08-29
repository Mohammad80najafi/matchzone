'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Me = { user: { id: string; username: string; displayName?: string } | null };

export default function Navbar() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(setMe).catch(() => setMe({ user: null }));
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-7 w-7 rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500" />
            <span className="font-bold tracking-tight">Matchzone</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <Link href="/lobbies" className="px-3 py-1.5 rounded-lg hover:bg-white/10">لابی‌ها</Link>
            <Link href="/leaderboard" className="px-3 py-1.5 rounded-lg hover:bg-white/10">لیدربرد</Link>
            <Link href="/events" className="px-3 py-1.5 rounded-lg hover:bg-white/10">ایونت‌ها</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/search" className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm">جستجو</Link>
          {me?.user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="px-3 py-1.5 rounded-lg bg-white/10 text-sm">
                {me.user.displayName || me.user.username}
              </Link>
              <form action="/api/auth/logout" method="post">
                <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm hover:bg-white/5">خروج</button>
              </form>
            </div>
          ) : (
            <Link href="/auth/register" className="px-3 py-1.5 rounded-xl bg-white text-black text-sm font-semibold">ورود</Link>
          )}
        </div>
      </div>
    </header>
  );
}
