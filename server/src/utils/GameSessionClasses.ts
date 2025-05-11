export class Player {
  constructor(
    public id: string,
    public name: string,
    public score: number = 0) {}
}

export class GameSession {
  public players: Player[] = [];
  public isStarted: boolean = false;

  constructor(public sessionId: string, public hostSocketId: string) {}

  addPlayer(player: Player): void {
    this.players.push(player);
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.find(p => p.id === playerId);
  }

  incrementScore(playerId: string): void {
    const player = this.getPlayer(playerId);
    if (player) {
      player.score += 1;
    }
  }
}
