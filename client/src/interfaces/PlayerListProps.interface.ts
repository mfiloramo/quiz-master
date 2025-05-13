export interface Player {
  id: string;
  username: string;
  score: number;
}

export interface PlayerListProps {
  players: Player[];
}
