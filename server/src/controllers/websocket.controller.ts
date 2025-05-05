import { Socket, Server } from "socket.io";
import { GameSession, Player } from "../utils/GameSessionClasses";

// IN-MEMORY STORE FOR ACTIVE SESSIONS
const activeSessions = new Map<string, GameSession>();

export class WebSocketController {
  constructor(private io: Server) {}

  // PLAYER JOINS SESSION
  joinSession(socket: Socket, data: { sessionId: string; playerId: string; name: string }): void {
    const { sessionId, playerId, name } = data;
    const session = activeSessions.get(sessionId);

    if (session) {
      const player = new Player(playerId, name);
      session.addPlayer(player);
      socket.join(sessionId);
      this.io.to(sessionId).emit("player-joined", session.players);
    } else {
      socket.emit("error", "Session not found.");
    }
  }

  // HOST STARTS SESSION
  startSession(socket: Socket, data: { sessionId: string }): void {
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
  submitAnswer(socket: Socket, data: { sessionId: string; playerId: string; isCorrect: boolean }): void {
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

  // HOST CREATES SESSION
  createSession(socket: Socket, sessionId: string): void {
    if (activeSessions.has(sessionId)) {
      socket.emit("error", "Session ID already exists.");
      return;
    }

    const session = new GameSession(sessionId, socket.id);
    activeSessions.set(sessionId, session);
    socket.join(sessionId);
    socket.emit("session-created", { sessionId });
  }

  // END SESSION
  endSession(socket: Socket, data: { sessionId: string }): void {
    const { sessionId } = data;
    this.io.to(sessionId).emit("session-ended");
    activeSessions.delete(sessionId);
  }

  // HANDLE DISCONNECT
  disconnect(socket: Socket): void {
    console.log(`Socket disconnected: ${socket.id}`);
  }
}
