import React, { ReactElement } from 'react';
import { Player, PlayerListProps } from '@/interfaces/PlayerListProps.interface';

export default function PlayerList({ players }: PlayerListProps): ReactElement {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          {player.name}: {player.score}
        </li>
      ))}
    </ul>
  );
}
