'use client';
import { useState } from 'react';

export default function CopyInviteButton({
  code,
  className,
  label = 'کپی لینک دعوت',
}: {
  code: string;
  className?: string;
  label?: string;
}) {
  const [done, setDone] = useState(false);

  return (
    <button
      type='button'
      className={className}
      onClick={async () => {
        const url = `${location.origin}/lobbies/${code}#join`;
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 1200);
      }}
      title='کپی لینک دعوت به لابی'
    >
      {done ? 'کپی شد ✓' : label}
    </button>
  );
}
