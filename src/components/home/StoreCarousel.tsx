'use client';
import { useMemo, useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

type StoreItem = {
  id: number | string;
  title: string;
  price: number;
  oldPrice?: number;
  img: string;
  badge?: string;
  discountPct?: number;
};

interface Props {
  title?: string;
  items?: StoreItem[]; // ← اختیاری
  fullWidth?: boolean;
  dealEndsAt?: Date | string;
  onSeeAll?: () => void;
}

const FALLBACK_ITEMS: StoreItem[] = [
  {
    id: 1,
    title: 'CP کالاف دیوتی',
    price: 50000,
    img: 'https://placehold.co/320x180?text=CP+CODM',
  },
  {
    id: 2,
    title: 'UC پابجی موبایل',
    price: 60000,
    img: 'https://placehold.co/320x180?text=UC+PUBG',
  },
  {
    id: 3,
    title: 'الماس MLBB',
    price: 40000,
    img: 'https://placehold.co/320x180?text=MLBB+Diamonds',
  },
  {
    id: 4,
    title: 'اسکین ویژه CS2',
    price: 120000,
    img: 'https://placehold.co/320x180?text=CS2+Skin',
  },
  {
    id: 5,
    title: 'Battle Pass',
    price: 80000,
    img: 'https://placehold.co/320x180?text=Battle+Pass',
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

export default function StoreCarousel({
  title = 'فروشگاه',
  items = FALLBACK_ITEMS, // ← پیش‌فرض امن
  fullWidth = true,
  dealEndsAt,
  onSeeAll,
}: Props) {
  const list = items?.length ? items : FALLBACK_ITEMS;
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
    <section id='store' className='w-full px-4 py-8'>
      <Container>
        <div className='overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F]'>
          {/* Header – تم خودمون */}
          <div className='flex items-center justify-between border-b-2 border-[#00FF85]/60 bg-[#121212] px-4 py-3 md:px-6'>
            <div className='flex items-center gap-2 text-white'>
              <ShoppingBag className='size-5 text-[#00FF85]' />
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
              {list.map((it) => (
                <div
                  key={it.id}
                  className='min-w-[260px] flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#121212] text-white'
                >
                  <div className='relative h-40 bg-[#0C0C0C]'>
                    <Image
                      src={it.img}
                      alt={it.title}
                      width={800}
                      height={400}
                      className='h-full w-full object-cover opacity-90'
                    />
                    {typeof it.discountPct === 'number' && (
                      <div className='absolute top-2 left-2 rounded-md bg-[#00FF85] px-2 py-1 text-xs font-bold text-black'>
                        %{it.discountPct}
                      </div>
                    )}
                  </div>
                  <div className='p-4'>
                    {it.badge && (
                      <div className='mb-1 text-[11px] font-bold text-[#00FF85]'>
                        {it.badge}
                      </div>
                    )}
                    <div className='line-clamp-2 text-sm font-semibold'>
                      {it.title}
                    </div>

                    <div className='mt-3 flex items-end justify-between'>
                      <div className='flex flex-col'>
                        <div className='text-base font-extrabold text-[#00FF85]'>
                          {formatPrice(it.price)} تومان
                        </div>
                        {it.oldPrice && (
                          <div className='text-[12px] text-gray-400 line-through'>
                            {formatPrice(it.oldPrice)} تومان
                          </div>
                        )}
                      </div>
                      <button className='rounded-md bg-[#00FF85] px-3 py-2 text-[13px] font-bold text-black'>
                        خرید سریع
                      </button>
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
