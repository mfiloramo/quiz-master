import { GameSession } from './GameSession';
import { Player } from './Player';


// SESSION MANAGER HANDLING IN-MEMORY STORE
export class SessionManager {
  private static sessions = new Map<string, GameSession>();

  public static createSession(
    sessionId: string,
    hostSocketId: string,
    hostUsername: string
  ): GameSession {
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
      if (session.hostSocketId === socketId || session.players.some((player: Player) => player.socketId === socketId)) {
        return [sessionId, session];
      }
    }
    return undefined;
  }
}
