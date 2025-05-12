import { Socket, Server } from 'socket.io';
import { GameSession, Player } from '../utils/GameSessionClasses';

const activeSessions = new Map<string, GameSession>();

export class WebSocketController {
  constructor(private io: Server) {}

  createSession(socket: Socket, sessionId: string): void {
    if (activeSessions.has(sessionId)) {
      socket.emit('error', 'Session already exists.');
      return;
    }

    const session = new GameSession(sessionId, socket.id);
    activeSessions.set(sessionId, session);
    socket.join(sessionId);
    socket.emit('session-created', { sessionId });
  }

  joinSession(socket: Socket, { sessionId, playerId, name }): void {
    const session = activeSessions.get(sessionId);
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    const player = new Player(playerId, name, socket.id);
    session.addPlayer(player);
    socket.join(sessionId);
    this.io.to(sessionId).emit('player-joined', session.players);
  }

  startSession(socket: Socket, { sessionId }): void {
    const session = activeSessions.get(sessionId);
    if (!session) return;
    this.io.to(sessionId).emit('session-started');
  }

  leaveSession(socket: Socket): void {
    for (const [sessionId, session] of activeSessions.entries()) {
      const removed = session.removePlayerBySocketId(socket.id);
      if (removed) {
        this.io.to(sessionId).emit('player-joined', session.players);
        break;
      }
    }
  }

  handleDisconnect(socket: Socket): void {
    for (const [sessionId, session] of activeSessions.entries()) {
      if (session.hostSocketId === socket.id) {
        this.io.to(sessionId).emit('session-ended');
        activeSessions.delete(sessionId);
        return;
      }

      const removed = session.removePlayerBySocketId(socket.id);
      if (removed) {
        this.io.to(sessionId).emit('player-joined', session.players);
      }
    }
  }
}
