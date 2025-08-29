// app/profile/page.tsx
import { connectDB } from '@/lib/db';
import { LobbyModel, type LobbyDoc } from '@/models/Lobby';
import { getUserIdSafe } from '@/lib/session';
import {
  startLobby,
  closeLobby,
  leaveLobby,
  deleteLobby,
} from '@/app/lobbies/[code]/actions';
import CopyInviteButton from '@/components/common/CopyInviteButton';
import { UserModel, type UserDoc } from '@/models/User'; // 👈
import { setAgeRange } from './actions';
import { AGE_OPTIONS } from '@/types/age';
import Link from 'next/link';
import { SortOrder } from 'mongoose';

export const metadata = { title: 'پروفایل | MatchZone' };

// پارامترهای URL برای تب/جست‌وجو/مرتب‌سازی/لیمیت
type SearchP = Promise<Record<string, string | string[] | undefined>>;

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: SearchP;
}) {
  const sp = await searchParams;
  const uid = await getUserIdSafe();

  // تب فعال
  const tab = (sp.tab as string) || 'owner'; // owner | member
  const q = ((sp.q as string) || '').trim();
  const sort = (sp.sort as string) || 'created_desc'; // created_desc|created_asc|players_desc|players_asc|status
  const limit = Number(sp.limit || 6);

  await connectDB();

  const myUser = uid
    ? await UserModel.findOne({ uid }).lean<UserDoc | null>() // 👈 این مهمه
    : null;

  // فیلتر پایه
  const baseFilter = (mine: boolean) => {
    const f: Record<string, unknown> = mine
      ? { ownerId: uid }
      : { members: uid, ownerId: { $ne: uid } };
    if (q) {
      f.$or = [
        { title: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
      ];
    }
    return f;
  };

  // مرتب‌سازی

  type SortSpec = Record<string, SortOrder>;
  const sortMap: Record<string, SortSpec> = {
    created_desc: { createdAt: -1 },
    created_asc: { createdAt: 1 },
    players_desc: { players: -1 },
    players_asc: { players: 1 },
    status: { status: 1, createdAt: -1 },
  };

  const sortObj = sortMap[sort] ?? sortMap.created_desc;

  // کوئری‌ها
  const [ownerLobbies, memberLobbies, totalOwner, totalMember] =
    await Promise.all([
      LobbyModel.find(baseFilter(true))
        .sort(sortObj)
        .limit(limit)
        .lean<LobbyDoc[]>(),
      LobbyModel.find(baseFilter(false))
        .sort(sortObj)
        .limit(limit)
        .lean<LobbyDoc[]>(),
      LobbyModel.countDocuments(baseFilter(true)),
      LobbyModel.countDocuments(baseFilter(false)),
    ]);

  const isOwnerTab = tab === 'owner';
  const list = isOwnerTab ? ownerLobbies : memberLobbies;
  const total = isOwnerTab ? totalOwner : totalMember;

  return (
    <div dir='rtl' className='min-h-screen bg-[#0A0A0A] p-6 text-[#E0E0E0]'>
      <div className='mx-auto max-w-6xl space-y-6'>
        {/* Header */}
        <header className='flex items-center justify-between rounded-xl border border-white/10 bg-[#1A1A1A] p-5'>
          <div>
            <h1 className='text-xl font-bold text-white'>پروفایل</h1>
            <p className='text-sm text-[#BBBBBB]'>
              شناسه شما: <span className='font-mono'>{uid}</span>
            </p>
          </div>
          <Link
            href='/lobbies/create'
            className='rounded-lg bg-[#00FF85] px-4 py-2 font-semibold text-black'
          >
            ساخت لابی جدید
          </Link>
        </header>
        <section className='rounded-xl border border-white/10 bg-[#111] p-4'>
          <h3 className='mb-2 font-semibold text-white'>محدوده سنی</h3>
          <form action={setAgeRange} className='flex items-center gap-3'>
            <select
              name='ageRange'
              defaultValue={myUser?.ageRange ?? ''} // 👈 ایمن
              required
              className='rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white'
            >
              <option value='' disabled>
                انتخاب محدوده سنی…
              </option>
              {AGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.replace('-', ' تا ')}
                  {opt === '35+' ? ' به بالا' : ''}
                </option>
              ))}
            </select>
            <button className='rounded-lg bg-[#00FF85] px-3 py-2 text-sm font-semibold text-black'>
              ذخیره
            </button>
          </form>
        </section>

        {/* Tabs */}
        <nav className='flex items-center gap-2'>
          <TabLink
            label='ساخته‌ام'
            active={isOwnerTab}
            href={`/profile?tab=owner&q=${encodeURIComponent(q)}&sort=${sort}&limit=${limit}`}
          />
          <TabLink
            label='عضو هستم'
            active={!isOwnerTab}
            href={`/profile?tab=member&q=${encodeURIComponent(q)}&sort=${sort}&limit=${limit}`}
          />
        </nav>

        {/* Filters */}
        <form
          action='/profile'
          className='flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111] p-4 md:flex-row md:items-center'
        >
          <input type='hidden' name='tab' value={tab} />
          <div className='flex-1'>
            <input
              name='q'
              defaultValue={q}
              placeholder='جست‌وجو در عنوان یا کد لابی…'
              className='w-full rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm'
            />
          </div>
          <div className='flex items-center gap-2'>
            <select
              name='sort'
              defaultValue={sort}
              className='rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm'
            >
              <option value='created_desc'>جدیدترین</option>
              <option value='created_asc'>قدیمی‌تر</option>
              <option value='players_desc'>بیشترین ظرفیت</option>
              <option value='players_asc'>کمترین ظرفیت</option>
              <option value='status'>وضعیت</option>
            </select>
            <select
              name='limit'
              defaultValue={String(limit)}
              className='rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm'
            >
              <option value='6'>۶</option>
              <option value='9'>۹</option>
              <option value='12'>۱۲</option>
            </select>
            <button className='rounded-lg bg-[#00FF85] px-4 py-2 text-sm font-semibold text-black'>
              اعمال
            </button>
          </div>
        </form>

        {/* List */}
        {list.length === 0 ? (
          <EmptyState
            text={
              isOwnerTab
                ? 'هنوز لابی‌ای نساخته‌ای.'
                : 'در هیچ لابی‌ای عضو نیستی.'
            }
          />
        ) : (
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
            {list.map((lobby: LobbyDoc) =>
              isOwnerTab ? (
                <OwnerCard key={lobby.code} lobby={lobby} />
              ) : (
                <MemberCard key={lobby.code} lobby={lobby} />
              )
            )}
          </div>
        )}

        {/* Load more */}
        {list.length < total && (
          <div className='flex justify-center'>
            <Link
              href={`/profile?tab=${tab}&q=${encodeURIComponent(q)}&sort=${sort}&limit=${limit + 6}`}
              className='rounded-lg border border-white/10 bg-[#1A1A1A] px-4 py-2 text-sm'
            >
              نمایش بیشتر
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- UI Partials ---------- */

function TabLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-lg border px-4 py-2 text-sm ${
        active
          ? 'border-transparent bg-[#00FF85] text-black'
          : 'border-white/10 bg-[#0E0E0E] text-white'
      }`}
    >
      {label}
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex items-center justify-between text-xs text-[#BBBBBB]'>
      <span>{label}</span>
      <span className='font-mono text-white'>{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: LobbyDoc['status'] }) {
  const map: Record<LobbyDoc['status'], string> = {
    open: 'باز',
    full: 'تکمیل',
    started: 'شروع شده',
    expired: 'منقضی',
    closed: 'بسته',
  };
  return (
    <span className='rounded border border-white/10 bg-[#0E0E0E] px-2 py-0.5 text-[10px] text-[#BBBBBB]'>
      {map[status]}
    </span>
  );
}

function CardShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1A1A1A] p-4'>
      <h3 className='text-sm font-semibold text-white'>{title}</h3>
      <div className='space-y-1'>{children}</div>
      {footer && (
        <div className='mt-1 border-t border-white/10 pt-2'>{footer}</div>
      )}
    </div>
  );
}

/* مالک */
function OwnerCard({ lobby }: { lobby: LobbyDoc }) {
  return (
    <CardShell title={lobby.title}>
      <Row label='بازی' value={lobby.game} />
      <Row label='ظرفیت' value={`${lobby.players}/${lobby.max}`} />
      <div className='flex items-center justify-between text-xs'>
        <span className='text-[#BBBBBB]'>وضعیت</span>
        <StatusPill status={lobby.status} />
      </div>
      <Row label='کد' value={lobby.code} />

      <div className='flex gap-2'>
        <form action={startLobby} className='flex-1'>
          <input type='hidden' name='code' value={lobby.code} />
          <button
            className='w-full rounded bg-[#00FF85] px-3 py-1.5 text-xs font-semibold text-black disabled:opacity-50'
            disabled={lobby.status === 'started'}
          >
            شروع
          </button>
        </form>
        <form action={closeLobby} className='flex-1'>
          <input type='hidden' name='code' value={lobby.code} />
          <button className='w-full rounded border border-white/10 bg-[#0E0E0E] px-3 py-1.5 text-xs text-white'>
            ریست
          </button>
        </form>
      </div>

      <div className='flex gap-2'>
        <Link
          href={`/lobbies/${lobby.code}`}
          className='flex-1 rounded bg-[#1E1B3A] px-3 py-1.5 text-center text-xs text-white'
        >
          جزئیات
        </Link>
        <CopyInviteButton
          code={lobby.code}
          className='flex-1 rounded border border-white/10 bg-[#0E0E0E] px-3 py-1.5 text-xs text-white'
          label='کپی دعوت'
        />
      </div>

      {/* حذف لابی */}
      <form action={deleteLobby}>
        <input type='hidden' name='code' value={lobby.code} />
        <button
          className='mt-2 w-full rounded border border-red-900/40 bg-[#2b1111] px-3 py-1.5 text-xs text-red-300'
          title='حذف لابی (غیرقابل بازگشت)'
        >
          حذف لابی
        </button>
      </form>
    </CardShell>
  );
}

/* عضو */
function MemberCard({ lobby }: { lobby: LobbyDoc }) {
  return (
    <CardShell title={lobby.title}>
      <Row label='بازی' value={lobby.game} />
      <Row label='ظرفیت' value={`${lobby.players}/${lobby.max}`} />
      <div className='flex items-center justify-between text-xs'>
        <span className='text-[#BBBBBB]'>وضعیت</span>
        <StatusPill status={lobby.status} />
      </div>
      <Row label='کد' value={lobby.code} />

      <div className='flex gap-2'>
        <Link
          href={`/lobbies/${lobby.code}`}
          className='flex-1 rounded border border-white/10 bg-[#1A1A1A] px-3 py-1.5 text-center text-xs text-white'
        >
          جزئیات
        </Link>
        <CopyInviteButton
          code={lobby.code}
          className='flex-1 rounded border border-white/10 bg-[#0E0E0E] px-3 py-1.5 text-xs text-white'
          label='کپی دعوت'
        />
      </div>

      <form action={leaveLobby}>
        <input type='hidden' name='code' value={lobby.code} />
        <button className='mt-2 w-full rounded border border-white/10 bg-[#262626] px-3 py-1.5 text-xs text-white'>
          خروج از لابی
        </button>
      </form>
    </CardShell>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className='rounded-xl border border-white/10 bg-[#141414] p-6 text-sm text-[#BBBBBB]'>
      {text}
    </div>
  );
}
