'use client';
import { useState } from 'react';

export default function CopyButton({
  text,
  label = 'کپی',
}: {
  text: string;
  label?: string;
}) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setOk(true);
        setTimeout(() => setOk(false), 1200);
      }}
      className='rounded bg-[#1E1B3A] px-3 py-1 text-sm text-[#00FF85]'
    >
      {ok ? 'کپی شد' : label}
    </button>
  );
}
