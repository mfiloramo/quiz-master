import React, { ReactElement } from 'react';
import { useSession } from '@/contexts/SessionContext';
import { Player } from '@/interfaces/PlayerListProps.interface';

export default function Leaderboard(): ReactElement {
  // CONTEXT HOOKS/CUSTOM HOOKS
  const { players } = useSession();

  // SORT PLAYERS LIST BY NAME (LATER SCORE)
  players.sort((a: Player, b: Player): number => b.score - a.score);

  // RENDER COMPONENT
  return (
    // MAIN CONTAINER
    <div className='flex h-fit flex-col items-center justify-center'>
      <h1 className='mb-6 text-5xl font-bold'>Player Leaderboard</h1>

      {/* MAIN DISPLAY */}
      <div
        className={
          'flex min-h-[40vh] w-[70vw] max-w-2xl flex-col rounded bg-slate-400 p-3 shadow-xl'
        }
      >
        {/* PLAYER RANKING */}
        {players.map((player: Player, index: number) => (
          <div
            key={index}
            className={'my-2 flex flex-row justify-between rounded bg-slate-300 p-3 px-6 py-4'}
          >
            <div>{player.username}</div>
            <div>Score: {player.score}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
