import { Player } from './Player';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';

// GAME SESSION MODEL FOR HOST + QUESTION MANAGEMENT
export class GameSession {
  public players: Player[] = [];
  public questions: QuestionAttributes[] = [];
  public hostUsername: string;
  public isStarted: boolean = false;
  public currentQuestionIndex: number = 0;

  constructor(
    public sessionId: string,
    public hostSocketId: string,
    hostUsername: string
  ) {
    this.hostUsername = hostUsername;
  }

  // ADD PLAYER TO SESSION
  addPlayer(player: Player): void {
    this.players.push(player);
  }

  // REMOVE PLAYER BY SOCKET ID
  removePlayerBySocketId(socketId: string): boolean {
    const initialLength = this.players.length;
    this.players = this.players.filter(p => p.socketId !== socketId);
    return this.players.length < initialLength;
  }

  // GET PLAYER BY ID
  getPlayer(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  // RESET ANSWER FLAGS
  resetAnswers(): void {
    this.players.forEach(p => (p.hasAnswered = false));
  }

  // ADVANCE TO NEXT QUESTION
  nextQuestion(): void {
    this.currentQuestionIndex++;
    this.resetAnswers();
  }

  // CHECK IF ALL PLAYERS ANSWERED
  allPlayersAnswered(): boolean {
    return this.players.every(p => p.hasAnswered);
  }
}
