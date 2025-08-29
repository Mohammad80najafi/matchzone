// components/lobbies/PricingFields.tsx
'use client';
import { useEffect, useState } from 'react';

function toTomans(rials: number) {
  return Math.floor((rials || 0) / 10).toLocaleString('fa-IR');
}

export default function PricingFields({
  initialIsPaid,
  initialEntryFee,
}: {
  initialIsPaid: boolean;
  initialEntryFee: number; // در "ریال"
}) {
  const [isPaid, setIsPaid] = useState<boolean>(initialIsPaid);
  const [fee, setFee] = useState<number>(initialEntryFee);

  // اگر از پولی به رایگان سوییچ شد، ورودی رو صفر و دیسِیبِل کن
  useEffect(() => {
    if (!isPaid) setFee(0);
  }, [isPaid]);

  return (
    <fieldset className='space-y-3 rounded-xl border border-white/10 p-4'>
      <legend className='px-2 text-sm text-[#BBBBBB]'>هزینه لابی</legend>

      {/* سوییچ پولی/رایگان */}
      <label className='flex items-center gap-2 text-sm'>
        <input
          type='checkbox'
          checked={isPaid}
          onChange={(e) => setIsPaid(e.target.checked)}
        />
        <span>لابی پولی</span>
      </label>

      {/* ورودی مبلغ (ریال) */}
      <div className='grid grid-cols-1 items-center gap-3 sm:grid-cols-2'>
        <div className='space-y-1'>
          <label className='text-xs text-[#BBBBBB]'>مبلغ ورودی (ریال)</label>
          <input
            type='number'
            inputMode='numeric'
            step={1000}
            value={fee}
            disabled={!isPaid}
            onChange={(e) => setFee(Math.max(0, Number(e.target.value || 0)))}
            className='w-full rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white disabled:opacity-50'
            placeholder='مثلاً 50000'
          />
        </div>

        {/* پیش‌نمایش تومان */}
        <div className='text-sm'>
          <div className='mb-1 text-[#BBBBBB]'>معادل (تومان):</div>
          <div className='font-semibold text-[#00FF85]'>
            {toTomans(fee)} تومان
          </div>
        </div>
      </div>

      {/* مقادیر واقعی برای Server Action */}
      <input type='hidden' name='isPaid' value={isPaid ? '1' : '0'} />
      <input type='hidden' name='entryFee' value={String(fee)} />
    </fieldset>
  );
}
