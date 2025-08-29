import { connectDB } from '@/lib/db';
import { LobbyModel, type LobbyDoc } from '@/models/Lobby';
import { notFound } from 'next/navigation';
import {
  joinLobby,
  leaveLobby,
  transferOwnership,
  removeMember,
} from './actions';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { startLobby, closeLobby } from './actions';
import CopyButton from '@/components/common/CopyButton';
import { getUserIdSafe } from '@/lib/session';
import Countdown from '@/components/common/CountDown';
import Link from 'next/link';

// Next 15: params/searchParams به صورت Promise هستند
type ParamsP = Promise<{ code: string }>;
type SearchParamsP = Promise<Record<string, string | string[] | undefined>>;

export const metadata = {
  title: 'جزئیات لابی | MatchZone',
};

export default async function LobbyDetail({
  params,
  searchParams,
}: {
  params: ParamsP;
  searchParams: SearchParamsP;
}) {
  const { code } = await params; // ✅ await لازم است
  const sp = await searchParams; // ✅ await لازم است

  await connectDB();

  const lobby = await LobbyModel.findOne({ code }).lean<LobbyDoc | null>();
  if (!lobby) notFound();

  if (
    lobby.expiresAt &&
    new Date() >= new Date(lobby.expiresAt) &&
    lobby.status !== 'expired'
  ) {
    await LobbyModel.updateOne(
      { code: lobby.code },
      { $set: { status: 'expired' } }
    );
    lobby.status = 'expired';
  }

  const me = await getUserIdSafe(); // ✅ در صفحات فقط read می‌کنیم (بدون set)
  const isMember = me ? (lobby.members?.includes(me) ?? false) : false;
  const isOwner = me ? lobby.ownerId === me : false;

  const error = typeof sp?.error === 'string' ? sp.error : undefined;
  const joined = sp?.joined === '1';
  const left = sp?.left === '1';
  const started = sp?.started === '1';
  const closed = sp?.closed === '1';
  const ownerChanged = sp?.owner_changed === '1';

  const isFull = lobby.players >= lobby.max || lobby.status === 'full';
  const isStarted = lobby.status === 'started';

  return (
    <div dir='rtl' className='min-h-screen bg-[#0A0A0A] p-6 text-[#E0E0E0]'>
      <div className='mx-auto max-w-4xl space-y-6'>
        {/* هدر + کپی کد */}
        <div className='flex items-center justify-between rounded-xl border border-white/10 bg-[#1A1A1A] p-5'>
          <div>
            <h1 className='text-xl font-bold text-white'>{lobby.title}</h1>
            {lobby.status === 'started' && lobby.expiresAt && (
              <div className='flex items-center gap-2'>
                <span className='text-xs text-[#BBBBBB]'>زمان باقی‌مانده:</span>
                + <Countdown endsAt={new Date(lobby.expiresAt).toISOString()} />
              </div>
            )}

            {lobby.status === 'expired' && (
              <div className='text-sm text-[#FF7575]'>
                این لابی منقضی شده است.
              </div>
            )}
            <p className='text-sm text-[#BBBBBB]'>
              {lobby.game} • {lobby.type} • کد:{' '}
              <span className='font-mono'>{lobby.code}</span>
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <CopyButton text={lobby.code} label='کپی کد' />
            <Link
              href='#join'
              className='inline-flex rounded-lg border border-white/10 bg-[#1A1A1A] px-4 py-2 text-white md:hidden'
            >
              رفتن به بخش پیوستن
            </Link>
          </div>
        </div>

        {/* پیام‌ها */}
        {(error || joined || left || started || closed) && (
          <div
            className={`rounded-lg p-3 text-sm ${
              joined
                ? 'bg-emerald-900/30 text-emerald-200'
                : left
                  ? 'bg-sky-900/30 text-sky-200'
                  : started
                    ? 'bg-indigo-900/30 text-indigo-200'
                    : closed
                      ? 'bg-zinc-900/30 text-zinc-200'
                      : 'bg-red-900/30 text-red-200'
            }`}
          >
            {joined && 'با موفقیت به لابی پیوستی ✅'}
            {left && 'از لابی خارج شدی.'}
            {started && 'لابی شروع شد.'}
            {closed && 'لابی باز شد (open).'}
            {error === 'notfound' && 'لابی پیدا نشد.'}
            {error === 'full' && 'ظرفیت لابی تکمیل شده است.'}
            {error === 'started' && 'این لابی شروع شده است.'}
            {error === 'forbidden' && 'دسترسی لازم را نداری.'}
            {error === 'not_member' && 'تو عضو این لابی نیستی.'}
            {ownerChanged && 'مالکیت با موفقیت منتقل شد.'}
            {error === 'bad_target' && 'کاربر مقصد نامعتبر است.'}
          </div>
        )}

        {/* اطلاعات + اعضا */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='rounded-xl border border-white/10 bg-[#1A1A1A] p-4'>
            <h2 className='mb-2 font-semibold text-[#00FF85]'>اطلاعات لابی</h2>
            <ul className='space-y-1 text-sm text-[#BBBBBB]'>
              <li>
                ظرفیت: {lobby.players}/{lobby.max}
              </li>
              <li>
                هزینه:{' '}
                {lobby.isPaid
                  ? `${Number(lobby.entryFee ?? 0).toLocaleString('fa-IR')} تومان`
                  : 'رایگان'}
              </li>
              <li>
                وضعیت:{' '}
                {lobby.status === 'open'
                  ? 'باز'
                  : lobby.status === 'full'
                    ? 'تکمیل'
                    : 'شروع‌شده'}
              </li>
              <li>
                مالک: <span className='font-mono'>{lobby.ownerId}</span>
                {isOwner && ' (شما)'}
              </li>
            </ul>
          </div>

          <div className='rounded-xl border border-white/10 bg-[#1A1A1A] p-4'>
            <h2 className='mb-2 font-semibold text-[#00FF85]'>اعضا</h2>
            <ul className='space-y-2'>
              {(lobby.members || []).map((m: string) => (
                <li
                  key={m}
                  className='flex items-center justify-between rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2'
                >
                  <span className='font-mono text-sm'>{m}</span>
                  <div className='flex items-center gap-2'>
                    {m === lobby.ownerId && (
                      <span className='text-xs text-[#00FF85]'>مالک</span>
                    )}
                    {me && m === me && (
                      <span className='text-xs text-[#BBBBBB]'>شما</span>
                    )}
                    {isOwner && m !== lobby.ownerId && (
                      <form action={removeMember}>
                        <input type='hidden' name='code' value={lobby.code} />
                        <input type='hidden' name='uid' value={m} />
                        <button className='rounded border border-red-900/40 bg-[#2b1111] px-2 py-1 text-[11px] text-red-300'>
                          حذف
                        </button>
                      </form>
                    )}
                  </div>
                </li>
              ))}
              {(!lobby.members || lobby.members.length === 0) && (
                <li className='text-xs text-[#888]'>—</li>
              )}
            </ul>
          </div>
        </div>

        {/* عملیات */}
        <div
          id='join'
          className='rounded-xl border border-white/10 bg-[#1A1A1A] p-4'
        >
          <h2 className='mb-3 font-semibold text-[#00FF85]'>عملیات</h2>

          <div className='flex flex-wrap items-center gap-3'>
            {/* Join / Leave */}
            {!isMember ? (
              <form action={joinLobby}>
                <input type='hidden' name='code' value={lobby.code} />
                <button
                  disabled={isFull || isStarted}
                  className={`rounded-lg px-4 py-2 font-semibold ${
                    isFull || isStarted
                      ? 'cursor-not-allowed bg-[#131313] text-[#777]'
                      : 'bg-[#00FF85] text-black'
                  }`}
                >
                  {isStarted
                    ? 'لابی شروع شده'
                    : isFull
                      ? 'ظرفیت تکمیل'
                      : 'پیوستن به لابی'}
                </button>
              </form>
            ) : (
              <form action={leaveLobby}>
                <input type='hidden' name='code' value={lobby.code} />
                <button className='rounded-lg border border-white/10 bg-[#262626] px-4 py-2 font-semibold text-white hover:opacity-90'>
                  خروج از لابی
                </button>
              </form>
            )}

            {/* Owner actions */}
            {isOwner && (
              <form
                action={transferOwnership}
                className='flex items-center gap-2'
              >
                <input type='hidden' name='code' value={lobby.code} />
                <select
                  name='uid'
                  className='rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white'
                  defaultValue=''
                  required
                >
                  <option value='' disabled>
                    انتخاب عضو برای انتقال مالکیت…
                  </option>
                  {(lobby.members || [])
                    .filter((m: string) => m !== lobby.ownerId)
                    .map((m: string) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                </select>
                <button
                  className='rounded-lg border border-white/10 bg-[#1A1A1A] px-4 py-2 font-semibold text-white hover:opacity-90'
                  title='انتقال مالکیت لابی'
                >
                  انتقال مالکیت
                </button>
              </form>
            )}

            <Link
              href='/lobbies'
              className='text-sm text-[#BBBBBB] hover:text-white'
            >
              مشاهده همه لابی‌ها
            </Link>
          </div>

          <p className='mt-2 text-xs text-[#888]'>
            لینک اشتراک:{' '}
            <span className='font-mono text-white'>/lobbies/{lobby.code}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
