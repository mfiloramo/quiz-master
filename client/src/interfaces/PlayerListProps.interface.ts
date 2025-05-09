export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface PlayerListProps {
  players: Player[];
}
