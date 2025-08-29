'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Users } from 'lucide-react';

type Lobby = {
  id: number | string;
  title: string;
  game: string;
  type: 'عمومی' | 'خصوصی' | string;
  paid: boolean;
  price: number;
  oldPrice?: number;
  players: number;
  max: number;
  img?: string;
  badge?: string;
  discountPct?: number;
};

interface Props {
  title?: string;
  items?: Lobby[]; // ← اختیاری
  fullWidth?: boolean;
  dealEndsAt?: Date | string;
  onSeeAll?: () => void;
}

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

const formatPrice = (n: number) => n.toLocaleString('fa-IR');
const TimePill = ({ children }: { children: React.ReactNode }) => (
  <span className='inline-flex min-w-8 justify-center rounded-md border border-[#00FF85]/40 bg-black/40 px-1 py-0.5 text-[12px] font-semibold text-white'>
    {children}
  </span>
);

function useCountdown(target?: Date | string) {
  const t = useMemo(() => (target ? new Date(target) : null), [target]);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!t) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [t]);
  if (!t) return null;
  const diff = Math.max(0, t.getTime() - now.getTime());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

export default function LobbiesCarousel({
  title = 'لابی‌های فعال',
  items = FALLBACK_LOBBIES, // ← پیش‌فرض امن
  fullWidth = true,
  dealEndsAt,
  onSeeAll,
}: Props) {
  const list = items?.length ? items : FALLBACK_LOBBIES; // ← یک لایه دفاعی دیگر
  const trackRef = useRef<HTMLDivElement>(null);
  const timer = useCountdown(dealEndsAt);

  const scrollByAmount = (dir: 'left' | 'right') => {
    const el = trackRef.current;
    if (!el) return;
    const delta = Math.floor(el.clientWidth * 0.85) * (dir === 'left' ? -1 : 1);
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const Container = ({ children }: { children: React.ReactNode }) =>
    fullWidth ? (
      <div className='w-full'>{children}</div>
    ) : (
      <div className='mx-auto max-w-6xl px-4'>{children}</div>
    );

  return (
    <section id='lobbies' className='w-full px-4 py-8'>
      <Container>
        <div className='overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F]'>
          {/* Header – تم خودمون */}
          <div className='flex items-center justify-between border-b-2 border-[#00FF85]/60 bg-[#121212] px-4 py-3 md:px-6'>
            <div className='flex items-center gap-2 text-white'>
              <Users className='size-5 text-[#00FF85]' />
              <h2 className='font-bold'>{title}</h2>
            </div>
            <div className='flex items-center gap-4'>
              {timer && (
                <div className='hidden items-center gap-1 font-mono sm:flex'>
                  <TimePill>{String(timer.h).padStart(2, '0')}</TimePill>:
                  <TimePill>{String(timer.m).padStart(2, '0')}</TimePill>:
                  <TimePill>{String(timer.s).padStart(2, '0')}</TimePill>
                </div>
              )}
              <button
                onClick={onSeeAll}
                className='text-sm font-semibold text-[#00FF85] hover:opacity-90'
              >
                نمایش همه
              </button>
            </div>
          </div>

          {/* Body */}
          <div className='relative bg-[#0E0E0E]'>
            {/* arrows */}
            <button
              onClick={() => scrollByAmount('left')}
              className='absolute top-1/2 left-2 z-20 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-[#1A1A1A]/70 text-white ring-1 ring-white/15 hover:bg-black/70 md:grid'
              aria-label='اسکرول چپ'
            >
              <ChevronRight className='size-5' />
            </button>
            <button
              onClick={() => scrollByAmount('right')}
              className='absolute top-1/2 right-2 z-20 hidden size-9 -translate-y-1/2 place-items-center rounded-full bg-[#1A1A1A]/70 text-white ring-1 ring-white/15 hover:bg-black/70 md:grid'
              aria-label='اسکرول راست'
            >
              <ChevronLeft className='size-5' />
            </button>

            {/* gradients */}
            <div className='pointer-events-none absolute top-0 right-0 bottom-0 z-10 hidden w-10 bg-gradient-to-l from-[#0E0E0E] to-transparent md:block' />
            <div className='pointer-events-none absolute top-0 bottom-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-[#0E0E0E] to-transparent md:block' />

            {/* track */}
            <div
              ref={trackRef}
              className='custom-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-4 py-5 md:px-6'
            >
              {list.map((lobby) => (
                <div
                  key={lobby.id}
                  className='min-w-[280px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#121212] text-white'
                >
                  <div className='p-4'>
                    <div className='mb-1 text-[11px] font-bold text-[#00FF85]'>
                      {lobby.badge}
                    </div>
                    <div className='line-clamp-2 text-sm font-semibold'>
                      {lobby.title}
                    </div>
                    <div className='mt-1 text-xs text-[#BBBBBB]'>
                      {lobby.game} • {lobby.type}
                    </div>

                    <div className='mt-3 flex items-end justify-between'>
                      <div className='flex flex-col'>
                        <div className='text-base font-extrabold text-[#00FF85]'>
                          {lobby.paid
                            ? `${formatPrice(lobby.price)} تومان`
                            : 'رایگان'}
                        </div>
                        {lobby.oldPrice && lobby.paid && (
                          <div className='text-[12px] text-gray-400 line-through'>
                            {formatPrice(lobby.oldPrice)} تومان
                          </div>
                        )}
                      </div>
                      <a className='rounded-md bg-[#00FF85] px-3 py-2 text-[13px] font-bold text-black'>
                        ورود به لابی
                      </a>
                    </div>

                    <div className='mt-3 text-[12px] text-[#BBBBBB]'>
                      بازیکن: {lobby.players}/{lobby.max}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
