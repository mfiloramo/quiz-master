import { ReactElement } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Player } from '@/interfaces/PlayerListProps.interface';

export default function Leaderboard(): ReactElement {
  // DEBUG: STUB PLAYERS
  const stubPlayers: Player[] = [
    { id: '1', username: 'testusername', score: 0 },
    { id: '3', username: 'test', score: 0 },
    { id: '4', username: 'testusername', score: 0 },
  ];

  // CUSTOM HOOKS
  const { players } = useSession();

  // RENDER COMPONENT
  return (
    <div className='flex flex-wrap items-center justify-center gap-4 px-12'>
      {players?.map((player: Player) => (
        <div
          key={player.id}
          className='mt-4 flex flex-col items-center rounded-xl bg-sky-200 p-4 text-black shadow-xl'
        >
          <div className='text-2xl font-extrabold'>{player.username}</div>
          <div className='text-lg'>Score: {player.score}</div>
        </div>
      ))}
    </div>
  );
}
