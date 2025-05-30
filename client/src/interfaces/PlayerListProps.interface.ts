export interface Player {
  id: number;
  username: string;
  score: number;
}

export interface PlayerListProps {
  players: Player[];
}
