export class Player {
  constructor(
    public id: string,
    public socketId: string, // SOCKET ID FOR DISCONNECT TRACKING
    public username: string,
    public score: number = 0,
    public hasAnswered: boolean = false // TRACK WHETHER PLAYER ANSWERED CURRENT QUESTION
  ) {}
}
