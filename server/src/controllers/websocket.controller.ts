import { Socket, Server } from "socket.io";
import { GameSession, Player } from "../utils/GameSessionClasses";
import { GameSessionAttributes } from '../interfaces/GameSessionAttributes.interface';

// IN-MEMORY STORE FOR ACTIVE SESSIONS
const activeSessions = new Map<string, GameSession>();

export class WebSocketController {
  constructor(private io: Server) {}

  // HOST CREATES A NEW SESSION
  createSession(socket: Socket, sessionId: string): void {
    if (activeSessions.has(sessionId)) {
      socket.emit("error", "Session ID already exists.");
      return;
    }

    const session = new GameSession(sessionId, socket.id);
    activeSessions.set(sessionId, session);
    socket.join(sessionId);
    socket.emit("session-created", { sessionId });
    if (session) console.log(`Session created: ${JSON.stringify(session)}`)
  }

  // PLAYER JOINS AN EXISTING SESSION
  joinSession(socket: Socket, data: GameSessionAttributes): void {
    console.log('joinSession invoked...');
    const { sessionId, playerId, name } = data;
    const session = activeSessions.get(sessionId);

    console.log(session);

    if (session) {
      const player = new Player(playerId, name);
      session.addPlayer(player);
      socket.join(sessionId);
      this.io.to(sessionId).emit("player-joined", session.players);
      socket.broadcast.emit("player-joined", session.players);
      console.log(session.players);
    } else {
      socket.emit("error", "Session not found.");
    }
  }

  // HOST STARTS THE SESSION
  startSession(socket: Socket, data: GameSessionAttributes): void {
    const { sessionId } = data;
    const session = activeSessions.get(sessionId);

    if (session) {
      session.isStarted = true;
      this.io.to(sessionId).emit("session-started");
    } else {
      socket.emit("error", "Session not found.");
    }
  }

  // PLAYER SUBMITS AN ANSWER
  submitAnswer(socket: Socket, data: GameSessionAttributes): void {
    const { sessionId, playerId, isCorrect } = data;
    const session = activeSessions.get(sessionId);

    if (session) {
      if (isCorrect) session.incrementScore(playerId);
      this.io.to(sessionId).emit("answer-received", {
        playerId,
        correct: isCorrect,
        score: session.getPlayer(playerId)?.score,
      });
    }
  }

  // HOST ENDS THE SESSION
  endSession(socket: Socket, data: GameSessionAttributes): void {
    const { sessionId } = data;
    this.io.to(sessionId).emit("session-ended");
    activeSessions.delete(sessionId);
  }
}
