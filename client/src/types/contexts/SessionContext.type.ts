import { Player } from '@/interfaces/PlayerListProps.interface';

export type SessionContextType = {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  clearSession: () => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
};
