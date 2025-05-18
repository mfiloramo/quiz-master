export class Player {
  constructor(
    public id: string,
    public username: string,
    public socketId: string, // SOCKET ID FOR DISCONNECT TRACKING
    public score: number = 0,
    public hasAnswered: boolean = false // TRACK WHETHER PLAYER ANSWERED CURRENT QUESTION
  ) {}
}
