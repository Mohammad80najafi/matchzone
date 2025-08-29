'use client';
import * as React from 'react';

export default function ScrollTo({
  target,
  className,
  children,
  offset = 0, // مثلا ارتفاع نوبار چسبان
}: {
  target: string; // e.g. "join"
  className?: string;
  children: React.ReactNode;
  offset?: number;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const el = document.getElementById(target);
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY - (offset ?? 0);
      window.scrollTo({ top, behavior: 'smooth' });
      // آدرس رو هم بدون رفرش آپدیت کنیم
      history.replaceState(null, '', `#${target}`);
    } else {
      // اگر هنوز عنصر رندر نشده، به‌عنوان fallback هش رو ست کن
      location.hash = `#${target}`;
    }
  };

  return (
    <button type='button' className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
