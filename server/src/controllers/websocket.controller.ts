import { Socket, Server } from 'socket.io';
import { GameSession, Player } from '../utils/GameSessionClasses';
import { GameSessionAttributes } from '../interfaces/GameSessionAttributes.interface';

const activeSessions = new Map<string, GameSession>();

export class WebSocketController {
  constructor(private io: Server) {}

  // TODO: HANDLE NAME VALIDATION ON DATABASE SIDE
  // CREATE NEW GAME SESSION
  createSession(socket: Socket, sessionData: GameSessionAttributes): void {
    const { sessionId, host } = sessionData;
    if (activeSessions.has(sessionId)) {
      socket.emit('error', 'Session already exists.');
      return;
    }

    const session = new GameSession(sessionId, socket.id);
    activeSessions.set(sessionId, session);
    socket.join(sessionId);
    socket.emit('session-created', { sessionId });
  }

  // TODO: HANDLE NAME VALIDATION ON DATABASE SIDE
  // JOIN EXISTING GAME SESSION
  joinSession(socket: Socket, sessionData: GameSessionAttributes): void {
    const { sessionId, playerId, username } = sessionData;
    const session = activeSessions.get(sessionId);
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    const player = new Player(playerId, username, socket.id);
    session.addPlayer(player);
    socket.join(sessionId);
    this.io.to(sessionId).emit('player-joined', session.players);
  }

  // START A NEW GAME SESSION
  startSession(socket: Socket, { sessionId }: any): void {
    const session = activeSessions.get(sessionId);
    if (!session) return;
    this.io.to(sessionId).emit('session-started');
  }

  // LEAVE AN EXISTING GAME SESSION
  leaveSession(socket: Socket): void {
    for (const [sessionId, session] of activeSessions.entries()) {
      const removed = session.removePlayerBySocketId(socket.id);
      if (removed) {
        this.io.to(sessionId).emit('player-joined', session.players);
        break;
      }
    }
  }

  // HANDLE PLAYER DISCONNECT FROM SESSION
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
