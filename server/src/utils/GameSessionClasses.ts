import User from '../models/User';

export class Player {
  constructor(
    public id: string,
    public username: string,
    public socketId: string, // ADDED SOCKET ID FOR DISCONNECT TRACKING
    public score: number = 0
  ) {}
}

export class GameSession {
  public players: Player[] = [];
  public hostUsername: string = '';
  public isStarted: boolean = false;

  constructor(public sessionId: string, public hostSocketId: string) {}

  // ADD A PLAYER TO THE SESSION
  addPlayer(player: Player): void {
    this.players.push(player);
  }

  // GET A PLAYER BY THEIR ID
  getPlayer(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  // INCREMENT A PLAYER'S SCORE
  incrementScore(playerId: string): void {
    const player = this.getPlayer(playerId);
    if (player) {
      player.score += 1;
    }
  }

  // REMOVE A PLAYER BY SOCKET ID (USED WHEN A PLAYER DISCONNECTS)
  removePlayerBySocketId(socketId: string): boolean {
    const initialLength = this.players.length;
    this.players = this.players.filter(player => player.socketId !== socketId);

    // RETURN TRUE IF A PLAYER WAS REMOVED
    return this.players.length < initialLength;
  }
}
