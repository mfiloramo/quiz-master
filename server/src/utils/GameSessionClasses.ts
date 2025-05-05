// CLASS TO REPRESENT EACH PLAYER IN A SESSION
export class Player {
  constructor(
    public id: string,
    public name: string,
    public score: number = 0
  ) {}
}

// CLASS TO REPRESENT A GAME SESSION
export class GameSession {
  public players: Player[] = [];
  public currentQuestionIndex: number = 0;
  public isStarted: boolean = false;

  constructor(public id: string, public hostSocketId: string) {}

  // ADD A PLAYER TO THE SESSION
  addPlayer(player: Player): void {
    this.players.push(player);
  }

  // FIND A PLAYER IN THE SESSION
  getPlayer(playerId: string): Player | undefined {
    return this.players.find((p) => p.id === playerId);
  }

  // INCREMENT SCORE FOR PLAYER
  incrementScore(playerId: string): void {
    const player = this.getPlayer(playerId);
    if (player) player.score += 1;
  }
}
