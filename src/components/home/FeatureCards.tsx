'use client';

import Link from 'next/link';
function Card({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <div className='rounded-2xl border border-white/10 bg-[#111] p-5'>
      <div className='text-lg font-semibold text-white'>{title}</div>
      <p className='mt-2 text-sm text-[#BBBBBB]'>{desc}</p>
      <Link
        href={href}
        className='mt-3 inline-block text-sm font-semibold text-[#00FF85]'
      >
        برو
      </Link>
    </div>
  );
}
export default function FeatureCards() {
  return (
    <section className='mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-8 md:grid-cols-3'>
      <Card
        title='لیدربورد ایران'
        desc='برترین‌های هر بازی را ببین.'
        href='/leaderboard'
      />
      <Card title='لابی‌ها' desc='رایگان/پولی، عمومی/خصوصی.' href='/lobbies' />
      <Card
        title='هم‌بازی'
        desc='با علایق مشترک هم‌بازی پیدا کن.'
        href='/hambazi'
      />
    </section>
  );
}
