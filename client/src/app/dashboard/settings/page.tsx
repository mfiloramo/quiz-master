import React, { ReactElement } from 'react';
import Image from 'next/image';
import Leaderboard from '@/components/leaderboard/leaderboard';
import FinalScoreboard from '@/components/final-scoreboard/final-scoreboard';

export default function Settings(): ReactElement {
  return (
    <div className={'flex flex-col items-center'}>
      {/*<Image*/}
      {/*  src={'/backgrounds/under-construction.jpg'}*/}
      {/*  width={612}*/}
      {/*  height={320}*/}
      {/*  alt={'under-construction'}*/}
      {/*/>*/}
      <FinalScoreboard />
    </div>
  );
}
