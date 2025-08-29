'use client';
import { useEffect, useState } from 'react';

import Link from 'next/link';

const LINKS = [
  { id: 'home', label: 'صفحه اصلی', href: '/' },
  { id: 'leaderboard', label: 'برترین‌ها', href: '#leaderboard' },
  { id: 'lobbies', label: 'لابی‌ها', href: '/lobbies' },
  { id: 'hambazi', label: 'هم‌بازی', href: '#hambazi' },
  { id: 'store', label: 'فروشگاه', href: '#store' },
  { id: 'contact', label: 'ارتباط با ما', href: '#contact' },
];

export default function Navbar() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const fn = () => setActive(location.hash.replace('#', '') || 'home');
    fn();
    addEventListener('hashchange', fn);
    return () => removeEventListener('hashchange', fn);
  }, []);

  return (
    <header className='sticky top-0 z-50 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/50'>
      <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-3 select-none'>
          <div className='grid h-9 w-9 place-items-center rounded-2xl bg-[#1E1B3A] shadow-[0_0_12px_rgba(0,255,133,.35)]'>
            <span className='font-black text-[#00FF85]'>MZ</span>
          </div>
          <span className='text-xs text-[#BFBFBF] sm:block sm:text-center'>
            میدان نبرد خودتان را پیدا کنید و به آن بپیوندید
          </span>
        </Link>
        <nav className='relative hidden items-center gap-1 md:flex'>
          <div className='absolute right-0 bottom-0 left-0 h-px bg-white/10' />
          {LINKS.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              onClick={() => setActive(l.id)}
              className={`relative rounded-xl px-3 py-2 text-sm hover:text-white ${active === l.id ? 'text-white' : 'text-[#BFBFBF]'}`}
            >
              {active === l.id && (
                <span className='absolute right-3 -bottom-[1px] left-3 h-[2px] rounded-full bg-[#00FF85]' />
              )}
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href='/profile'
          className='rounded-xl bg-[#00FF85] px-4 py-2 text-sm font-semibold text-black md:inline-block'
        >
          پروفایل
        </Link>
      </div>
    </header>
  );
}
