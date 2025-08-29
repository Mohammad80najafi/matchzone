'use client';
import Image from 'next/image';
import { useState } from 'react';
const BANNERS = [
  {
    t: 'تورنمنت بزرگ PUBG',
    s: 'جوایز ویژه برای نفرات برتر',
    img: 'https://placehold.co/1600x400?text=PUBG',
  },
  {
    t: 'CS2 Tehran Open',
    s: '۵v۵ حرفه‌ای‌ها',
    img: 'https://placehold.co/1600x400?text=CS2',
  },
  {
    t: 'Mobile Legends',
    s: 'مسابقه تیم‌های ۵ نفره',
    img: 'https://placehold.co/1600x400?text=MLBB',
  },
];
export default function Hero() {
  const [i, setI] = useState(0);
  const n = () => setI((i + 1) % BANNERS.length);
  const p = () => setI((i - 1 + BANNERS.length) % BANNERS.length);
  const b = BANNERS[i];
  return (
    <section
      id='home'
      className='relative w-full overflow-hidden border-b border-white/10'
    >
      <div className='relative flex h-64 items-center justify-between bg-black md:h-96'>
        <Image
          src={b.img}
          alt={b.t}
          width={1600}
          height={400}
          className='absolute inset-0 h-full w-full object-cover opacity-70'
        />
        <div className='relative z-10 max-w-lg space-y-2 p-6'>
          <h2 className='text-2xl font-bold text-white md:text-4xl'>{b.t}</h2>
          <p className='text-sm text-[#F0F0F0] md:text-lg'>{b.s}</p>
          <a
            href='#events'
            className='inline-block rounded bg-[#00FF85] px-4 py-2 text-sm font-semibold text-black'
          >
            مشاهده جزئیات
          </a>
        </div>
        <button
          onClick={p}
          className='absolute inset-y-0 left-4 my-auto h-8 w-8 rounded-full bg-black/40 text-white'
        >
          ‹
        </button>
        <button
          onClick={n}
          className='absolute inset-y-0 right-4 my-auto h-8 w-8 rounded-full bg-black/40 text-white'
        >
          ›
        </button>
      </div>
      <div className='absolute bottom-3 z-10 flex w-full justify-center gap-2'>
        {BANNERS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 w-2 rounded-full ${idx === i ? 'bg-[#00FF85]' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </section>
  );
}
