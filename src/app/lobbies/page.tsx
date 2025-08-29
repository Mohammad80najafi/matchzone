// app/lobbies/page.tsx  (Server Component, Next 15-friendly)
import { connectDB } from '@/lib/db';
import { LobbyModel, type LobbyDoc } from '@/models/Lobby';
import FiltersBar from '@/components/lobbies/FiltersBar';
import LobbyCard from '@/components/lobbies/LobbyCard';
import Link from 'next/link';

// اگر از این تایپ جایی استفاده می‌کنی، نگهش دار
export const metadata = { title: 'همه لابی‌ها | MatchZone' };

// کمک‌تابع: از searchParams مقدار تکی را بردار (اگر آرایه بود، اولین را)
function pick(qs: Record<string, string | string[] | undefined>, key: string) {
  const v = qs[key];
  return Array.isArray(v) ? v[0] : v;
}

type Mode = 'all' | 'free' | 'paid';

// ✅ در Next 15، searchParams باید Promise باشه
export default async function LobbiesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  await connectDB();

  const qs = (await searchParams) ?? {};

  const code = (pick(qs, 'code') || '').trim();
  const game = pick(qs, 'game') || '';
  const type = pick(qs, 'type') || '';
  const mode = (pick(qs, 'mode') as Mode) || 'all';

  const genderParam =
    pick(qs, 'genderConstraint') || pick(qs, 'allowedGender') || 'any';

  const pageStr = pick(qs, 'page') || '1';
  const pageNum = Math.max(parseInt(pageStr, 10) || 1, 1);
  const limit = 12;
  const skip = (pageNum - 1) * limit;

  // ساخت کوئری بر اساس فیلترها
  const q: Record<string, unknown> = {};
  if (code) q.code = code;

  // 🎯 نام درست در مدل: genderConstraint
  if (genderParam === 'male' || genderParam === 'female')
    q.genderConstraint = genderParam;

  if (
    game &&
    ['CS2', 'COD Mobile', 'PUBG Mobile', 'Mobile Legends'].includes(game)
  ) {
    q.game = game;
  }

  if (type && ['عمومی', 'خصوصی'].includes(type)) {
    q.type = type;
  }

  // 🎯 نام درست در مدل: isPaid / entryFee
  if (mode === 'free') {
    q.isPaid = false;
    q.entryFee = 0;
  } else if (mode === 'paid') {
    q.isPaid = true;
    q.entryFee = { $gt: 0 };
  }

  const [items, total] = await Promise.all([
    LobbyModel.find(q)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<LobbyDoc[]>(),
    LobbyModel.countDocuments(q),
  ]);

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div dir='rtl' className='min-h-screen bg-[#0A0A0A] text-[#E0E0E0]'>
      <div className='mx-auto max-w-7xl space-y-6 px-4 py-8'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold'>لیست همه لابی‌ها</h1>
          <Link
            href='/lobbies/create'
            className='text-sm text-[#00FF85] hover:opacity-90'
          >
            + ساخت لابی
          </Link>
        </div>

        {/* نوار فیلترها (کلاینت) — لازم نیست تغییرش بدی */}
        <FiltersBar
          initial={{
            code: code || '',
            game: game || '',
            type: type || '',
            mode: (mode as Mode) || 'all',
            // اگر FiltersBar فیلد جنسیت دارد، این را هم بده (در صورت نیاز):
            // genderConstraint: (genderParam as 'any'|'male'|'female') || 'any',
          }}
        />

        {/* نتایج */}
        <div className='rounded-2xl border border-white/10 bg-[#0E0E0E] p-4'>
          {items.length === 0 ? (
            <div className='py-12 text-center text-sm text-[#BBBBBB]'>
              لابی مطابق با فیلترهای شما پیدا نشد.
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
              {items.map((lobby: LobbyDoc) => (
                <LobbyCard key={lobby.code} lobby={lobby} />
              ))}
            </div>
          )}
        </div>

        <Pagination current={pageNum} totalPages={totalPages} />
      </div>
    </div>
  );
}

function Pagination({
  current,
  totalPages,
}: {
  current: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const prev = Math.max(current - 1, 1);
  const next = Math.min(current + 1, totalPages);

  return (
    <div className='flex items-center justify-center gap-2'>
      <PageLink page={prev} disabled={current === 1}>
        قبلی
      </PageLink>
      <span className='text-xs text-[#BBBBBB]'>
        صفحه {current} از {totalPages}
      </span>
      <PageLink page={next} disabled={current === totalPages}>
        بعدی
      </PageLink>
    </div>
  );
}

function PageLink({
  page,
  disabled,
  children,
}: {
  page: number;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const cls = disabled
    ? 'px-3 py-2 text-xs rounded-lg bg-[#131313] text-[#777]'
    : 'px-3 py-2 text-xs rounded-lg bg-[#1A1A1A] text-white border border-white/10 hover:opacity-90';
  return disabled ? (
    <span className={cls}>{children}</span>
  ) : (
    <Link className={cls} href={`?page=${page}`}>
      {children}
    </Link>
  );
}
