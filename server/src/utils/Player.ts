export class Player {
  constructor(
    public id: number,
    public socketId: string,
    public username?: string,
    public score: number = 0,
    public hasAnswered: boolean = false
  ) {}
}
