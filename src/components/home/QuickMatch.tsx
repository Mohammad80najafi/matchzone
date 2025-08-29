'use client';

import * as React from 'react';

export type QuickFilters = {
  game: string; // CS2 | CODM | ...
  role: string; // فعلاً رزرو
  rank: string; // فعلاً رزرو
  lobby: '' | 'all' | 'free' | 'paid';
};

export default function QuickMatch({
  onSearch,
}: {
  onSearch: (filters: QuickFilters) => void;
}) {
  const [filters, setFilters] = React.useState<QuickFilters>({
    game: 'CS2',
    role: '',
    rank: '',
    lobby: 'all',
  });

  const update =
    (k: keyof QuickFilters) => (e: React.ChangeEvent<HTMLSelectElement>) =>
      setFilters((f) => ({
        ...f,
        [k]: e.target.value as QuickFilters[typeof k],
      }));

  return (
    <section id='quick-match' className='mx-auto max-w-6xl space-y-5 px-4 py-8'>
      <h2 className='text-xl font-bold text-white'>شروع سریع مچ</h2>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-5'>
        <select
          value={filters.game}
          onChange={update('game')}
          className='rounded border border-white/20 bg-[#0A0A0A] px-3 py-2 text-white'
        >
          <option>CS2</option>
          <option>COD Mobile</option>
          <option>PUBG Mobile</option>
          <option>Mobile Legends</option>
        </select>
        <select
          value={filters.role}
          onChange={update('role')}
          className='rounded border border-white/20 bg-[#0A0A0A] px-3 py-2 text-white'
        >
          <option value=''>نقش</option>
        </select>
        <select
          value={filters.rank}
          onChange={update('rank')}
          className='rounded border border-white/20 bg-[#0A0A0A] px-3 py-2 text-white'
        >
          <option value=''>رنک</option>
        </select>
        <select
          value={filters.lobby}
          onChange={update('lobby')}
          className='rounded border border-white/20 bg-[#0A0A0A] px-3 py-2 text-white'
        >
          <option value='all'>نوع لابی: همه</option>
          <option value='free'>رایگان</option>
          <option value='paid'>پولی</option>
        </select>
        <button
          onClick={() => onSearch(filters)}
          className='rounded bg-[#00FF85] px-4 py-2 text-center font-semibold text-black'
        >
          پیدا کن
        </button>
      </div>
    </section>
  );
}
