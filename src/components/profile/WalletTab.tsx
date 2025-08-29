import { ensureWallet } from '@/lib/wallet';
import { getUserIdSafe } from '@/lib/session';
import { depositDemo, withdrawRequest } from '@/app/wallet/actions';

function formatIRR(v: number) {
  return v.toLocaleString('fa-IR');
}

export default async function WalletTab() {
  const uid = await getUserIdSafe();
  const w = await ensureWallet(uid!);

  return (
    <div className='space-y-4 rounded-xl border border-white/10 bg-[#111] p-4'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='text-sm text-[#BBBBBB]'>موجودی</div>
          <div className='text-2xl font-bold text-white'>
            {formatIRR(w.balance)} ریال
          </div>
        </div>
        <div>
          <div className='text-sm text-[#BBBBBB]'>بلوکه (اسکرو)</div>
          <div className='text-lg font-semibold text-white'>
            {formatIRR(w.hold)} ریال
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <form
          action={depositDemo}
          className='flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E0E0E] p-3'
        >
          <input
            name='amount'
            placeholder='مبلغ (تومان)'
            className='w-full rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white'
          />
          <button className='rounded-lg bg-[#00FF85] px-3 py-2 text-sm font-semibold text-black'>
            شارژ
          </button>
        </form>

        <form
          action={withdrawRequest}
          className='flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E0E0E] p-3'
        >
          <input
            name='amount'
            placeholder='برداشت (تومان)'
            className='w-full rounded-lg border border-white/10 bg-[#0E0E0E] px-3 py-2 text-sm text-white'
          />
          <button className='rounded-lg bg-[#1E1B3A] px-3 py-2 text-sm font-semibold text-[#00FF85]'>
            درخواست برداشت
          </button>
        </form>
      </div>

      <div className='text-xs text-[#888]'>
        * درگاه واقعی به‌زودی متصل می‌شود. در حال حاضر «شارژ» نمایشی است.
      </div>
    </div>
  );
}
