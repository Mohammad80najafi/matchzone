// components/lobbies/LobbyCard.tsx  (Server Component)
import type { LobbyDoc } from '@/models/Lobby';
import { toTomansLabel } from '@/lib/money';

export default function LobbyCard({ lobby }: { lobby: LobbyDoc }) {
  return (
    <a
      href={`/lobbies/${lobby.code}`}
      className='flex flex-col gap-2 rounded-xl border border-white/10 bg-[#1A1A1A] p-4 transition hover:shadow-[0_0_12px_rgba(0,255,133,.25)]'
    >
      <div className='flex items-center justify-between'>
        <h2 className='line-clamp-1 text-sm font-semibold text-white'>
          {lobby.title}
        </h2>
        <span className='rounded bg-[#00FF85] px-2 py-0.5 text-xs text-black'>
          {lobby.type}
        </span>
      </div>
      <p className='text-xs text-[#BBBBBB]'>{lobby.game}</p>
      <div className='flex items-center justify-between text-sm'>
        <span>
          {lobby.players}/{lobby.max} بازیکن
        </span>
        <span className='rounded bg-white/10 px-2 py-0.5 text-xs'>
          {lobby.genderConstraint === 'any'
            ? 'همه'
            : lobby.genderConstraint === 'male'
              ? 'آقایان'
              : 'بانوان'}
        </span>
        {(lobby.entryFee ?? 0) > 0 ? (
          <span className='font-semibold text-[#00FF85]'>
            {toTomansLabel(lobby.entryFee ?? 0)}
          </span>
        ) : (
          <span className='text-[#BBBBBB]'>رایگان</span>
        )}
      </div>
      <p className='text-[11px] text-[#888]'>کد لابی: {lobby.code}</p>
    </a>
  );
}
