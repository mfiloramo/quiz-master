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
    <div className={'my-4 flex w-[30vw] flex-col rounded-md bg-slate-100 p-4 shadow-xl'}>
      {stubPlayers.map((player: Player, index: number) => (
        <div
          key={index}
          className={'my-1 flex flex-row justify-around rounded-md bg-slate-300 p-4'}
        >
          {player.id}
          {player.username}
          {player.score}
        </div>
      ))}
    </div>
  );
}
