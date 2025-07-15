import React, { ReactElement } from 'react';
import { Player, PlayerListProps } from '@/interfaces/PlayerListProps.interface';

export default function PlayerList({ players }: PlayerListProps): ReactElement {
  return (
    <ul>
      {players.map((player: Player) => (
        <li key={player.id}>
          {player.username}: {player.score}
        </li>
      ))}
    </ul>
  );
}
