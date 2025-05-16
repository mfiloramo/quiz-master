import { Player } from './Player';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';

// GAME SESSION MODEL FOR HOST + QUESTION MANAGEMENT
export class GameSession {
  public players: Player[] = [];
  public questions: QuestionAttributes[] = [];
  public quizId?: number;
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
  public addPlayer(player: Player): void {
    this.players.push(player);
  }

  // REMOVE PLAYER BY SOCKET ID
  public removePlayerBySocketId(socketId: string): boolean {
    const initialLength: number = this.players.length;
    this.players = this.players.filter((player: Player): boolean => player.socketId !== socketId);
    return this.players.length < initialLength;
  }

  // REMOVE PLAYER BY PLAYER ID
  public removePlayerByPlayerId(playerId: string): boolean {
    const initialLength: number = this.players.length;
    this.players = this.players.filter((player: Player): boolean =>
      player.id !== playerId);
    return this.players.length < initialLength;
  }

  // GET PLAYER BY ID
  public getPlayer(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  // RESET ANSWER FLAGS
  public resetAnswers(): void {
    this.players.forEach((player: Player) => (player.hasAnswered = false));
  }

  // ADVANCE TO NEXT QUESTION
  public nextQuestion(): void {
    this.currentQuestionIndex += 1;
    this.resetAnswers();
  }

  // CHECK IF ALL PLAYERS ANSWERED
  public allPlayersAnswered(): boolean {
    return this.players.every(p => p.hasAnswered);
  }
}
