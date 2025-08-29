'use client';
export default function Countdown({ endsAt }: { endsAt: string }) {
  // Minimal no-error stub (replace with real countdown later)
  return <span>{new Date(endsAt).toLocaleString('fa-IR')}</span>;
}
