import { Socket, Server } from 'socket.io';
import { GameSessionAttributes } from '../interfaces/GameSessionAttributes.interface';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';
import { SessionManager } from '../utils/SessionManager';
import { Player } from '../utils/Player';
import { sequelize } from '../config/sequelize';;

export class WebSocketController {
  constructor(private io: Server) {}

  // CREATE NEW GAME SESSION
  public createSession(socket: Socket, sessionData: GameSessionAttributes): void {
    const { sessionId, hostUserName } = sessionData;

    if (SessionManager.getSession(sessionId)) {
      socket.emit('error', 'Session already exists.');
      return;
    }

    const session = SessionManager.createSession(sessionId, socket.id, hostUserName);
    socket.join(sessionId);
    socket.emit('session-created', {
      sessionId,
      hostUsername: session.hostUsername,
    });
  }

  // JOIN EXISTING GAME SESSION
  public joinSession(socket: Socket, sessionData: GameSessionAttributes): void {
    const { sessionId, playerId, username } = sessionData;
    const session = SessionManager.getSession(sessionId);

    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    const nameExists = session.players.some((player: Player) => player.username === username);
    if (nameExists) {
      socket.emit('error', 'Player with this username already joined the game.');
      return;
    }

    const player = new Player(playerId, username, socket.id);
    session.addPlayer(player);
    socket.join(sessionId);
    this.io.to(sessionId).emit('player-joined', session.players);
  }

  // START GAME SESSION
  public async startSession(socket: Socket, { sessionId, quizId }: { sessionId: string, quizId: number }): Promise<void> {

    const session = SessionManager.getSession(sessionId);
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    try {
      // FETCH QUESTIONS FOR GIVEN QUIZ ID
      const result = await sequelize.query('EXECUTE GetQuestionsByQuizId :quizId', {
        replacements: { quizId },
      });

      // FORMAT QUESTIONS
      const formattedQuestions: QuestionAttributes[] = result[0].map((question: any) => ({
        ...question,
        options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      }));

      // STORE QUESTIONS IN MEMORY
      session.questions = formattedQuestions;
      session.isStarted = true;

      // EMIT SESSION STARTED
      this.io.to(sessionId).emit('session-started');

      // EMIT FIRST QUESTION TO ALL PLAYERS
      const firstQuestion = formattedQuestions[0];

      if (firstQuestion) {
        this.io.to(sessionId).emit('new-question', {
          question: firstQuestion,
          index: 0,
          total: formattedQuestions.length,
        });
      }
    } catch (error: any) {
      console.error('Error starting session:', error);
      socket.emit('error', 'Failed to start quiz.');
    }
  }

  // PLAYER LEAVES SESSION
  public leaveSession(socket: Socket): void {
    const result = SessionManager.getSessionBySocketId(socket.id);
    if (!result) return;

    const [sessionId, session] = result;
    const removed = session.removePlayerBySocketId(socket.id);
    if (removed) {
      this.io.to(sessionId).emit('player-joined', session.players);
    }
  }

  // GET CURRENT QUESTION FOR A SESSION
  public getCurrentQuestion(socket: Socket, { sessionId }: { sessionId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session || !session.questions.length) {
      socket.emit('error', 'No current question found.');
      return;
    }

    const currentQuestion = session.questions[session.currentQuestionIndex];

    socket.emit('new-question', {
      question: currentQuestion,
      index: session.currentQuestionIndex,
      total: session.questions.length,
    });
  }

  // HANDLE PLAYER EJECTION
  public handleEjectPlayer(socket: Socket, { sessionId, playerId }: { sessionId: string, playerId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    // ONLY ALLOW HOST TO EJECT
    if (socket.id !== session.hostSocketId) {
      socket.emit('error', 'Only the host can eject players.');
      return;
    }

    const playerToKick = session.getPlayer(playerId);
    if (!playerToKick) return;

    // SEND TO SPECIFIC PLAYER
    this.io.to(playerToKick.socketId).emit('ejected-by-host');

    // REMOVE FROM SESSION
    session.removePlayerByPlayerId(playerId);

    // BROADCAST UPDATED LIST
    this.io.to(sessionId).emit('player-joined', session.players);
  }

  // HANDLE SOCKET DISCONNECT
  public handleDisconnect(socket: Socket): void {
    const result = SessionManager.getSessionBySocketId(socket.id);
    if (!result) return;

    const [sessionId, session] = result;

    if (session.hostSocketId === socket.id) {
      this.io.to(sessionId).emit('session-ended');
      SessionManager.deleteSession(sessionId);
    } else {
      const removed = session.removePlayerBySocketId(socket.id);
      if (removed) {
        this.io.to(sessionId).emit('player-joined', session.players);
      }
    }
  }
}
