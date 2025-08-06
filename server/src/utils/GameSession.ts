// GAME SESSION MODEL FOR HOST + QUESTION MANAGEMENT
import { Player } from './Player';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';

export class GameSession {
  public players: Player[] = [];
  public questions: QuestionAttributes[] = [];
  public playerAnswers: string[] = [];
  public quizId?: number;
  public hostUsername: string;
  public isStarted: boolean = false;
  public currentQuestionIndex: number = 0;
  public roundTimer!: number; // TIMER IN MS
  public currentRoundTimeout?: NodeJS.Timeout;
  public currentGameStartTimeout?: NodeJS.Timeout;
  public scoreCounter: number = 100

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
  public removePlayerByPlayerId(id: number): boolean {
    const initialLength: number = this.players.length;
    this.players = this.players.filter((player: Player): boolean =>
      player.id !== id);
    return this.players.length < initialLength;
  }

  // GET PLAYER BY ID
  public getPlayerById(id: number): Player | undefined {
    return this.players.find(player => player.id === id);
  }

  // GET PLAYER BY SOCKET ID
  public getPlayerBySocketId(socketId: string): Player | undefined {
    return this.players.find(player => player.socketId === socketId);
  }

  // INCREMENT PLAYER SCORE
  public incrementScore(id: number) {
    const player = this.getPlayerById(id);
    if (player) {
      player.score += Math.ceil(this.scoreCounter);
      if (player.score > 40) this.scoreCounter -= 15;
    }
  }

  // RESET ANSWER FLAGS
  public resetAnswers(): void {
    this.players.forEach((player: Player): boolean => (player.hasAnswered = false));
  }

  // RESET SCORE COUNTER
  public resetScoreCounter(): void {
    this.scoreCounter = 100;
  }

  // ADVANCE TO NEXT QUESTION
  public nextQuestion(): void {
    this.currentQuestionIndex += 1;
    this.resetAnswers();
    this.resetScoreCounter();
  }

  // CHECK IF ALL PLAYERS ANSWERED
  public allPlayersAnswered(): boolean {
    return this.players.every(player => player.hasAnswered);
  }

  // CLEAR ANY ACTIVE ROUND TIMEOUT
  public clearRoundTimeout(): void {
    if (this.currentRoundTimeout) {
      clearTimeout(this.currentRoundTimeout);
      this.currentRoundTimeout = undefined; // ENSURE TIMEOUT CLEARED FROM MEMORY
    }
  }
}
