import { GameSession } from './GameSession';
import { Player } from './Player';

export class SessionManager {
  private static sessions = new Map<string, GameSession>();

  public static createSession(
    sessionId: string,
    hostSocketId: string,
    hostUsername: string
  ): GameSession {
    // IF SESSION ALREADY EXISTS, CLEAR TIMEOUT AND DELETE STALE DATA
    const existing = this.sessions.get(sessionId);
    if (existing) {
      existing.clearGameStartTimeout(); // ENSURE TIMER IS CLEARED
      this.sessions.delete(sessionId); // REMOVE STALE SESSION COMPLETELY
    }

    // CREATE NEW SESSION INSTANCE
    const session = new GameSession(sessionId, hostSocketId, hostUsername);
    this.sessions.set(sessionId, session);
    return session;
  }

  public static getSession(sessionId: string): GameSession | undefined {
    return this.sessions.get(sessionId);
  }

  public static deleteSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  public static getSessionBySocketId(socketId: string): [string, GameSession] | undefined {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (
        session.hostSocketId === socketId ||
        session.players.some((player: Player) => player.socketId === socketId)
      ) {
        return [sessionId, session];
      }
    }
    return undefined;
  }
}
