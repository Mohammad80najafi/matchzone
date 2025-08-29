'use client';
export default function FriendsOnline() {
  return (
    <section className='w-full border-b border-white/10 bg-[#0E0E0E] py-8'>
      <div className='mx-auto max-w-6xl px-4'>
        <h2 className='mb-6 text-xl font-bold text-white'>دوستان آنلاین</h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-10'>
          <div className='grid h-32 place-items-center rounded-xl bg-[#1A1A1A] p-6 text-[#BBBBBB] md:col-span-7'>
            هنوز دوستی نداری
          </div>
          <div className='grid h-32 place-items-center rounded-xl border border-white/10 bg-[#1A1A1A] p-6 text-[#BBBBBB] md:col-span-3'>
            آمار شما تاکنون
          </div>
        </div>
      </div>
    </section>
  );
}
