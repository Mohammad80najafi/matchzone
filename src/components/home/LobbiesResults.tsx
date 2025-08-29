'use client';
import { X, Users } from 'lucide-react';

export type Lobby = {
  id: number | string;
  title: string;
  game: string;
  type: 'عمومی' | 'خصوصی' | string;
  paid: boolean;
  price: number;
  oldPrice?: number;
  players: number;
  max: number;
};

export default function LobbiesResults({
  items,
  show,
  loading = false,
  onClear,
  title = 'نتایج جست‌وجو',
}: {
  items: Lobby[];
  show: boolean;
  loading?: boolean;
  onClear?: () => void;
  title?: string;
}) {
  if (!show) return null;

  return (
    <section className='mx-auto mt-2 mb-8 max-w-7xl px-4'>
      <div className='mb-3 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Users className='size-5 text-[#00FF85]' />
          <h3 className='font-bold text-white'>{title}</h3>
          {!loading && (
            <span className='text-xs text-[#BBBBBB]'>
              ({items.length} نتیجه)
            </span>
          )}
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className='flex items-center gap-1 text-xs text-[#BBBBBB] hover:text-white'
          >
            پاک‌کردن فیلترها <X className='size-4' />
          </button>
        )}
      </div>

      <div className='rounded-2xl border border-white/10 bg-[#0E0E0E] p-4'>
        {loading && (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className='min-h-[120px] animate-pulse rounded-xl bg-[#141414]'
              />
            ))}
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className='py-8 text-center text-sm text-[#BBBBBB]'>
            چیزی مطابق فیلترهای شما پیدا نشد.
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {items.map((lobby) => (
              <div
                key={lobby.id}
                className='flex flex-col gap-3 rounded-xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:shadow-[0_0_12px_rgba(0,255,133,.25)]'
              >
                <div className='flex items-center justify-between'>
                  <div className='line-clamp-1 text-sm font-semibold text-white'>
                    {lobby.title}
                  </div>
                  <span className='rounded bg-[#00FF85] px-2 py-0.5 text-xs text-black'>
                    {lobby.type}
                  </span>
                </div>
                <div className='text-xs text-[#BBBBBB]'>{lobby.game}</div>
                <div className='flex items-center justify-between text-sm'>
                  <span>
                    {lobby.players}/{lobby.max} بازیکن
                  </span>
                  {lobby.paid ? (
                    <span className='font-semibold text-[#00FF85]'>
                      {lobby.price.toLocaleString()} تومان
                    </span>
                  ) : (
                    <span className='text-[#BBBBBB]'>رایگان</span>
                  )}
                </div>
                <a
                  href='#join'
                  className='mt-1 rounded-lg bg-[#00FF85] px-3 py-2 text-center text-sm font-semibold text-black'
                >
                  ورود به لابی
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
