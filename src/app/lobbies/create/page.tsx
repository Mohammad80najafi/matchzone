// app/lobbies/create/page.tsx
import React from 'react';
import { createLobby } from './actions';
// اگر PricingFields را قبلاً ساخته‌اید (کلاینت)، این ایمپورت را نگه‌دارید.
// اگر ندارید، می‌توانید موقتاً این سطر را کامنت کنید تا فرم بدون دیسِیبل شدن قیمت کار کند.
import PricingFields from '@/components/lobbies/PricingFields';
import Link from 'next/link';

export const metadata = {
  title: 'ساخت لابی | MatchZone',
};

const GAMES = ['CS2', 'COD Mobile', 'PUBG Mobile', 'Mobile Legends'] as const;
const TYPES = ['عمومی', 'خصوصی'] as const;
const AGE_OPTIONS = ['12-18', '18-26', '26-35', '35+'] as const;

export default async function CreateLobbyPage() {
  return (
    <div dir='rtl' className='min-h-screen bg-[#0A0A0A] text-[#E0E0E0]'>
      <div className='mx-auto max-w-3xl px-4 py-8'>
        {/* هدر */}
        <header className='mb-6 flex items-center justify-between rounded-xl border border-white/10 bg-[#0E0E0E] px-5 py-4'>
          <div>
            <h1 className='text-xl font-bold text-white'>ساخت لابی جدید</h1>
            <p className='mt-1 text-sm text-[#BBBBBB]'>
              لطفاً اطلاعات لابی را کامل کنید.
            </p>
          </div>
        </header>

        {/* فرم ساخت لابی */}
        <form action={createLobby} className='grid grid-cols-1 gap-5'>
          {/* عنوان */}
          <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
            <label className='mb-2 block text-sm text-[#BBBBBB]'>
              عنوان لابی
            </label>
            <input
              name='title'
              required
              placeholder='مثلاً: اسکواد CS2 ایران'
              className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
            />
          </div>

          {/* بازی + نوع لابی */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
              <label className='mb-2 block text-sm text-[#BBBBBB]'>بازی</label>
              <select
                name='game'
                className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
                defaultValue={GAMES[0]}
                required
              >
                {GAMES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
              <label className='mb-2 block text-sm text-[#BBBBBB]'>
                نوع لابی
              </label>
              <select
                name='type'
                className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
                defaultValue={TYPES[0]}
                required
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ظرفیت + رده سنی */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
              <label className='mb-2 block text-sm text-[#BBBBBB]'>ظرفیت</label>
              <input
                type='number'
                name='max'
                min={1}
                max={10}
                defaultValue={5}
                required
                className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
              />
              <p className='mt-1 text-xs text-[#888]'>حداکثر ۱۰ نفر</p>
            </div>

            <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
              <label className='mb-2 block text-sm text-[#BBBBBB]'>
                ردهٔ سنی کاربران
              </label>
              <select
                name='ageRange'
                className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
                defaultValue={AGE_OPTIONS[1]} // پیش‌فرض 18-26
                required
              >
                {AGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.replace('-', ' تا ') +
                      (opt.endsWith('+') ? '' : ' سال')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* قیمت/رایگان (کلاینت) */}
          {/* اگر PricingFields را دارید، این بخش را نگه دارید. */}
          <PricingFields initialEntryFee={0} initialIsPaid={false} />
          {/* مدت زمان لابی (دقیقه) */}
          <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
            <label className='mb-2 block text-sm text-[#BBBBBB]'>
              مدت باز بودن لابی (دقیقه)
            </label>
            <input
              type='number'
              name='durationMins'
              min={5}
              max={24 * 60}
              defaultValue={60}
              required
              className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
            />
            <p className='mt-1 text-xs text-[#888]'>
              حداقل ۵ دقیقه، حداکثر ۲۴ ساعت.
            </p>
          </div>
          <div>
            <label className='text-sm text-[#BBBBBB]'>محدودیت جنسیت</label>
            <select
              name='genderConstraint'
              className='mt-1 w-full rounded border border-white/20 bg-[#0A0A0A] px-3 py-2 text-white'
            >
              <option value='any'>بدون محدودیت</option>
              <option value='male'>فقط آقایان</option>
              <option value='female'>فقط خانم‌ها</option>
            </select>
          </div>
          {/* توضیحات */}
          <div className='rounded-xl border border-white/10 bg-[#0E0E0E] p-4'>
            <label className='mb-2 block text-sm text-[#BBBBBB]'>توضیحات</label>
            <textarea
              name='description'
              rows={4}
              placeholder='اگر نکته‌ای هست (قوانین، زمان‌بندی، شرایط ورود و ...)، اینجا بنویس.'
              className='mt-1 w-full rounded-lg border border-white/10 bg-[#0A0A0A] px-3 py-2 text-sm text-white'
            />
          </div>

          {/* اکشن‌ها */}
          <div className='flex items-center justify-end gap-3'>
            <Link
              href='/lobbies'
              className='rounded-lg border border-white/10 bg-[#121212] px-4 py-2 text-sm'
            >
              انصراف
            </Link>
            <button
              className='rounded-lg bg-[#00FF85] px-5 py-2 text-sm font-semibold text-black hover:opacity-90'
              type='submit'
            >
              ساخت لابی
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
