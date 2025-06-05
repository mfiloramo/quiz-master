'use client';

import React, { ReactElement } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';
import { Player } from '@/interfaces/PlayerListProps.interface';

// COMPONENT CONSTANTS
const displayOrder = [1, 0, 2];
const barHeights = ['70%', '100%', '40%'];
const barColors = ['bg-amber-500', 'bg-green-600', 'bg-red-500'];
const delays = [1.0, 1.5, 0.5];

export default function FinalScoreboard(): ReactElement {
  // CUSTOM HOOKS
  const { players } = useSession();

  // CHECK FOR VALID PLAYERS LIST
  if (!players || players.length === 0) {
    return <p className='text-white'>No players available.</p>;
  }

  // SORT PLAYERS LIST BY NAME (LATER SCORE)
  const sortedPlayers: Player[] = [...players].sort((a, b) => b.score - a.score);
  const playerFinalists: Player[] = sortedPlayers.slice(0, 3);

  // RENDER COMPONENT
  return (
    <div className='flex h-fit flex-col items-center justify-center'>
      <h1 className='mb-6 text-5xl font-bold'>Final Scoreboard</h1>

      {/* INNER CONTAINER */}
      <div className='flex h-[40vh] w-fit max-w-2xl items-end justify-between gap-6 rounded bg-slate-400 px-8 py-4 shadow-xl'>
        {displayOrder.map((i: number) => (
          <motion.div
            key={i}
            initial={{ height: '0%' }}
            animate={{ height: barHeights[displayOrder.indexOf(i)] }}
            transition={{
              duration: 0.8,
              delay: delays[displayOrder.indexOf(i)],
              ease: [0, 0.71, 0.2, 1.01],
            }}
            className={`flex w-32 min-w-24 max-w-36 flex-col items-center justify-end rounded-xl ${barColors[displayOrder.indexOf(i)]} text-white shadow-xl`}
          >
            <div className='p-2 text-center'>
              <div className='text-lg font-semibold'>{playerFinalists[i].username}</div>
              <div className='text-sm'>Score: {playerFinalists[i].score}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
