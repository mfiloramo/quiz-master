export interface GameSessionAttributes {
  sessionId: string;
  quizId?: number;
  hostUserName: string;
  socketId?: string;
  username?: string;
  roundTimer: number;
  gameStartTimer: number;
}
