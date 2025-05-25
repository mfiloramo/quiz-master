import { Socket, Server } from 'socket.io';
import { GameSessionAttributes } from '../interfaces/GameSessionAttributes.interface';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';
import { SessionManager } from '../utils/SessionManager';
import { Player } from '../utils/Player';
import { sequelize } from '../config/sequelize';
import user from '../models/User';
import { GameSession } from '../utils/GameSession';


export class WebSocketController {
  constructor(private io: Server) {}

  /** PUBLIC METHODS **/

  // CREATE NEW GAME SESSION
  public createSession(socket: Socket, data: GameSessionAttributes): void {
    // DESTRUCTURE SESSION DATA
    const { sessionId, hostUserName, quizId, roundTimer } = data;

    // CHECK FOR EXISTING SESSION
    if (SessionManager.getSession(sessionId)) {
      socket.emit('error', 'Session already exists.');
      return;
    }

    // CREATE NEW SESSION
    const session = SessionManager.createSession(sessionId, socket.id, hostUserName);

    // CLEANUP: RESET QUESTIONS ARRAY IN CASE OF ANY STALE STATE
    session.questions = [];

    // SET QUIZ ID SO IT CAN BE USED IN startSession()
    session.quizId = quizId;

    // SET ROUND TIMER
    session.roundTimer = roundTimer * 1000;

    // JOIN GAME SESSION
    socket.join(sessionId);

    // EMIT SESSION DATA
    socket.emit('session-created', {
      sessionId,
      hostUsername: session.hostUsername,
    });
  }

  // JOIN EXISTING GAME SESSION
  public joinSession(socket: Socket, data: Player & GameSessionAttributes): void {
    const { id, sessionId, username } = data;
    const session = SessionManager.getSession(sessionId);

    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    // TODO: ENABLE IN PROD -- CHECK IF PLAYER HAS ALREADY JOINED
    // const nameExists = session.players.some((player: Player) => player.username === username);
    // if (nameExists) {
    //   socket.emit('error', 'Player with this username already joined the game.');
    //   return;
    // }

    // INSTANTIATE NEW PLAYER
    const player = new Player(id, socket.id, username);

    // ADD PLAYER TO SESSION AND JOIN
    session.addPlayer(player);
    socket.join(sessionId);

    // EMIT UPDATED PLAYER LIST
    this.io.to(sessionId).emit('player-joined', session.players);

    // IF GAME HAS STARTED, SEND CURRENT QUESTION TO NEWLY JOINED PLAYER
    if (session.isStarted) {
      const currentQuestion = session.questions[session.currentQuestionIndex];
      socket.emit('new-question', {
        question: currentQuestion,
        index: session.currentQuestionIndex,
        total: session.questions.length,
      });
    }
  }

  // START GAME SESSION
  public async startSession(socket: Socket, { sessionId }: { sessionId: string }): Promise<void> {
    const session = SessionManager.getSession(sessionId);
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    if (!session.quizId) {
      socket.emit('error', 'Quiz not set for this session.');
      return;
    }

    try {
      const result = await sequelize.query('EXECUTE GetQuestionsByQuizId :quizId', {
        replacements: { quizId: session.quizId },
      });

      const formattedQuestions: QuestionAttributes[] = result[0].map((question: any) => ({
        ...question,
        options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      }));

      session.questions = formattedQuestions;
      session.isStarted = true;

      this.io.to(sessionId).emit('session-started');

      const firstQuestion = formattedQuestions[0];
      if (firstQuestion) {
        this.emitQuestionWithTimeout(session);
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

  // RETURN CURRENT QUESTION TO REQUESTING PLAYER
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
      roundTimer: session.roundTimer
    });
  }

  // GET PLAYER LIST FOR CLIENT THAT MISSED INITIAL BROADCAST
  public getPlayers(socket: Socket, { sessionId }: { sessionId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;
    socket.emit('player-joined', session.players); // SEND LATEST PLAYER LIST
  }

  // HANDLE PLAYER ANSWER SUBMISSION
  public submitAnswer(socket: Socket, sessionData: any): void {
    const { sessionId, answer } = sessionData;
    const session = SessionManager.getSession(sessionId);
    const player = session?.getPlayerBySocketId(socket.id);

    if (!player || player.hasAnswered) return;
    player.hasAnswered = true;

    if (answer === session?.questions[session.currentQuestionIndex].correct) {
      session!.incrementScore(player.id);
      this.io.to(sessionId).emit('player-joined', session!.players);
    }

    if (session!.allPlayersAnswered()) {
      session!.clearRoundTimeout(); // CLEAR TIMEOUT IF ALL ANSWERED EARLY

      this.io.to(sessionId).emit('all-players-answered');

      setTimeout(() => {
        session!.nextQuestion();
        const next = session!.questions[session!.currentQuestionIndex];
        if (next) {
          this.emitQuestionWithTimeout(session!); // REUSE METHOD
        } else {
          this.io.to(session!.sessionId).emit('session-ended');
          SessionManager.deleteSession(session!.sessionId);
        }
      }, 5000); // WAIT FOR LEADERBOARD TO SHOW
    }
  }


  // HOST-ONLY: EJECT SPECIFIC PLAYER
  public handleEjectPlayer(socket: Socket, { sessionId, id }: { sessionId: string; id: string }): void {
    // GET SESSION
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    // CHECK IF USER IS HOST
    if (socket.id !== session.hostSocketId) {
      socket.emit('error', 'Only the host can eject players.');
      return;
    }

    // GET PLAYER
    const player = session.getPlayerById(id);
    if (!player) return;

    // SEND EJECTION TO PLAYER
    this.io.to(player.socketId).emit('ejected-by-host');

    // REMOVE FROM SESSION
    session.removePlayerByPlayerId(id);

    // BROADCAST UPDATED PLAYER LIST
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

  /** PRIVATE METHODS **/

  // EMIT QUESTION WITH TIMEOUT
  private emitQuestionWithTimeout(session: GameSession): void {
    const sessionId = session.sessionId;
    const currentQuestion = session.questions[session.currentQuestionIndex];

    // EMIT QUESTION TO ALL CLIENTS
    this.io.to(sessionId).emit('new-question', {
      question: currentQuestion,
      index: session.currentQuestionIndex,
      total: session.questions.length,
      roundTimer: session.roundTimer
    });

    // CLEAR ANY EXISTING TIMEOUT BEFORE SETTING A NEW ONE
    session.clearRoundTimeout();

    // SET TIMEOUT TO FORCE NEXT QUESTION IF NOT ALL PLAYERS ANSWER
    session.currentTimeout = setTimeout(() => {
      if (!session.allPlayersAnswered()) {
        // MARK ALL AS ANSWERED TO PREVENT RE-EMIT
        session.players.forEach(p => (p.hasAnswered = true));

        this.io.to(sessionId).emit('all-players-answered');

        setTimeout(() => {
          session.nextQuestion();
          const next = session.questions[session.currentQuestionIndex];
          if (next) {
            this.emitQuestionWithTimeout(session); // RECURSE
          } else {
            this.io.to(sessionId).emit('session-ended');
            SessionManager.deleteSession(sessionId);
          }
        }, 5000); // WAIT FOR LEADERBOARD TO SHOW
      }
    }, session.roundTimer);
  }

}
