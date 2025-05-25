import { ReactElement } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Player } from '@/interfaces/PlayerListProps.interface';

export default function Leaderboard(): ReactElement {
  // CUSTOM HOOKS
  const { players } = useSession();

  {
    /* TODO: CHECK IF SORTING ALGORITHM IS WORKING IN REAL-TIME */
  }
  // SORT PLAYERS LIST BY NAME (LATER SCORE)
  players.sort((a: Player, b: Player): number => b.score - a.score);

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center justify-center gap-4 px-12'>
      {/* PLAYERS LIST */}
      {players?.map((player: Player, index: number) => (
        <div
          key={index} // TODO: MAKE KEY PLAYER.ID (INDEX FOR DEV MODE)
          className='mt-4 flex flex-col items-center rounded-xl bg-sky-200 p-4 text-black shadow-xl'
        >
          <div className='text-2xl font-extrabold'>{player.username}</div>
          <div className='text-lg'>Score: {player.score}</div>
        </div>
      ))}
    </div>
  );
}
