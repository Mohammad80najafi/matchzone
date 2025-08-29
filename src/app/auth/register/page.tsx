'use client';

import { useState } from 'react';

type Step = 'phone' | 'verify' | 'done';

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<Step>('phone');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | undefined>();

  async function requestOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(undefined);
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'خطا در ارسال کد');
      setStep('verify');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(undefined);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? 'کد درست نیست');
      setStep('done');
      // هدایت به پروفایل برای تکمیل ثبت‌نام
      setTimeout(() => {
        window.location.href = '/profile';
      }, 600);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'خطای ناشناخته');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-black to-zinc-950 text-white flex items-center justify-center p-4'>
      <div className='w-full max-w-sm rounded-2xl border border-white/10 p-6 backdrop-blur'>
        <h1 className='mb-6 text-center text-lg font-bold'>ثبت‌نام / ورود</h1>
        {step === 'phone' && (
          <form onSubmit={requestOtp} className='space-y-3'>
            <input
              className='w-full rounded-lg bg-white/5 px-3 py-2 text-right'
              placeholder='مثال: 0912xxxxxxx'
              dir='ltr'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button
              className='w-full rounded-lg bg-white/10 py-2 disabled:opacity-50'
              disabled={loading}
              type='submit'
            >
              {loading ? 'در حال ارسال...' : 'ارسال کد'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyOtp} className='space-y-3'>
            <input
              className='w-full rounded-lg bg-white/5 px-3 py-2 text-center tracking-[0.3em]'
              placeholder='******'
              dir='ltr'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode='numeric'
              pattern='\d{6}'
              maxLength={6}
              required
            />
            <button
              className='w-full rounded-lg bg-white/10 py-2 disabled:opacity-50'
              disabled={loading}
              type='submit'
            >
              {loading ? 'در حال ورود...' : 'تایید و ادامه'}
            </button>
            <button
              type='button'
              className='w-full rounded-lg border border-white/10 py-2 text-sm'
              onClick={() => setStep('phone')}
            >
              تغییر شماره
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className='text-center text-sm text-green-400'>ورود موفق — در حال انتقال...</div>
        )}

        {err && <p className='mt-3 text-xs text-red-400'>{err}</p>}
      </div>
    </div>
  );
}
