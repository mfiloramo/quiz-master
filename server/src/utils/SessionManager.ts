import { GameSession } from './GameSession';

// SESSION MANAGER HANDLING IN-MEMORY STORE
export class SessionManager {
  private static sessions = new Map<string, GameSession>();

  static createSession(sessionId: string, hostSocketId: string, hostUsername: string): GameSession {
    const session = new GameSession(sessionId, hostSocketId, hostUsername);
    this.sessions.set(sessionId, session);
    return session;
  }

  static getSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  static deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  static getSessionBySocketId(socketId: string): [string, GameSession] | undefined {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.hostSocketId === socketId || session.players.some(p => p.socketId === socketId)) {
        return [sessionId, session];
      }
    }
    return undefined;
  }
}
