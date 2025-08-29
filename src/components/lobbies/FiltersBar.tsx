'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

type Mode = 'all' | 'free' | 'paid';
type Gender = 'any' | 'male' | 'female';

type Filters = {
  code?: string;
  game?: string;
  type?: string;
  mode?: Mode;
  genderConstraint?: Gender;
};

export default function FiltersBar({ initial }: { initial?: Filters }) {
  const router = useRouter();
  const params = useSearchParams();

  const [code, setCode] = useState(initial?.code ?? '');
  const [game, setGame] = useState(initial?.game ?? '');
  const [type, setType] = useState(initial?.type ?? '');
  const [mode, setMode] = useState<Mode>(initial?.mode ?? 'all');
  const [gender, setGender] = useState<Gender>(
    initial?.genderConstraint ?? 'any'
  );

  const qs = useMemo(() => {
    const u = new URLSearchParams(params.toString());
    // پاک‌سازی قبلی‌ها
    ['code', 'game', 'type', 'mode', 'genderConstraint', 'page'].forEach((k) =>
      u.delete(k)
    );
    if (code.trim()) u.set('code', code.trim());
    if (game) u.set('game', game);
    if (type) u.set('type', type);
    if (mode !== 'all') u.set('mode', mode);
    if (gender !== 'any') u.set('genderConstraint', gender);
    u.set('page', '1');
    return u.toString();
  }, [params, code, game, type, mode, gender]);

  const apply = useCallback(() => {
    router.push(`/lobbies?${qs}`);
  }, [router, qs]);

  return (
    <div className='space-y-3 rounded-2xl border border-white/10 bg-[#0E0E0E] p-4'>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-5'>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder='کد لابی'
          className='rounded border border-white/10 bg-[#131313] px-3 py-2 text-sm'
        />
        <select
          value={game}
          onChange={(e) => setGame(e.target.value)}
          className='rounded border border-white/10 bg-[#131313] px-3 py-2 text-sm'
        >
          <option value=''>همه بازی‌ها</option>
          <option value='CS2'>CS2</option>
          <option value='COD Mobile'>COD Mobile</option>
          <option value='PUBG Mobile'>PUBG Mobile</option>
          <option value='Mobile Legends'>Mobile Legends</option>
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className='rounded border border-white/10 bg-[#131313] px-3 py-2 text-sm'
        >
          <option value=''>نوع لابی</option>
          <option value='عمومی'>عمومی</option>
          <option value='خصوصی'>خصوصی</option>
        </select>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className='rounded border border-white/10 bg-[#131313] px-3 py-2 text-sm'
        >
          <option value='all'>همه</option>
          <option value='free'>رایگان</option>
          <option value='paid'>پولی</option>
        </select>

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          className='rounded border border-white/10 bg-[#131313] px-3 py-2 text-sm'
        >
          <option value='any'>بدون محدودیت جنسیت</option>
          <option value='male'>فقط آقایان</option>
          <option value='female'>فقط بانوان</option>
        </select>
      </div>
      <div className='flex justify-end'>
        <button
          onClick={apply}
          className='rounded-lg bg-[#00FF85] px-4 py-2 text-sm font-semibold text-black hover:opacity-90'
        >
          اعمال فیلتر
        </button>
      </div>
    </div>
  );
}
