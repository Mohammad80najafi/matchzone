'use client';
import QuickMatch, { QuickFilters } from './QuickMatch';
import LobbiesResults, { Lobby } from './LobbiesResults';
import * as React from 'react';

// دیتای نمونه؛ بعداً از API میاد
const FALLBACK_LOBBIES: Lobby[] = [
  {
    id: 1,
    title: 'PUBG – اسکواد شبانه',
    game: 'PUBG Mobile',
    type: 'عمومی',
    paid: true,
    price: 8000,
    players: 2,
    max: 4,
  },
  {
    id: 2,
    title: 'CODM – رنک آپ',
    game: 'COD Mobile',
    type: 'عمومی',
    paid: false,
    price: 0,
    players: 9,
    max: 10,
  },
  {
    id: 3,
    title: 'CS2 – استک ایران',
    game: 'CS2',
    type: 'خصوصی',
    paid: true,
    price: 12000,
    players: 7,
    max: 10,
  },
  {
    id: 4,
    title: 'MLBB – Push Mythic',
    game: 'Mobile Legends',
    type: 'عمومی',
    paid: false,
    price: 0,
    players: 3,
    max: 5,
  },
  {
    id: 5,
    title: 'CS2 – Dust II Farmers',
    game: 'CS2',
    type: 'عمومی',
    paid: true,
    price: 15000,
    players: 4,
    max: 5,
  },
];

export default function QuickMatchWithResults({
  allLobbies,
}: {
  allLobbies?: Lobby[];
}) {
  const data = allLobbies?.length ? allLobbies : FALLBACK_LOBBIES;

  const [results, setResults] = React.useState<Lobby[] | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = (filters: QuickFilters) => {
    setLoading(true);

    const filtered = data.filter((l) => {
      const gameOk =
        !filters.game ||
        l.game.toLowerCase().includes(filters.game.toLowerCase()) ||
        l.game === filters.game;

      const typeOk =
        !filters.lobby ||
        filters.lobby === 'all' ||
        (filters.lobby === 'free' && !l.paid) ||
        (filters.lobby === 'paid' && l.paid);

      // نقش/رنک فعلاً نداریم → بعداً به مدل اضافه می‌کنیم
      return gameOk && typeOk;
    });

    setTimeout(() => {
      setResults(filtered);
      setLoading(false);
    }, 300);
  };

  return (
    <>
      <QuickMatch onSearch={handleSearch} />
      <LobbiesResults
        items={results ?? []}
        show={results !== null}
        loading={loading}
        onClear={() => setResults(null)}
        title='نتایج جست‌وجوی شما'
      />
    </>
  );
}
