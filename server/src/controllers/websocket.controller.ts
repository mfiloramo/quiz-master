import { Socket, Server } from 'socket.io';
import { SessionManager } from '../utils/SessionManager';
import { GameSession } from '../utils/GameSession';
import { Player } from '../utils/Player';
import { sequelize } from '../config/sequelize';
import { redis } from '../config/redis';
import { GameSessionAttributes } from '../interfaces/GameSessionAttributes.interface';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';


// MAIN SOCKET CONTROLLER CLASS
export class WebSocketController {
  constructor(private io: Server) {
  }

  /** PUBLIC METHODS **/
// CREATE NEW GAME SESSION
  public createSession(socket: Socket, data: GameSessionAttributes): void {
    // DESTRUCTURE SESSION DATA
    const { sessionId, hostUserName, quizId, roundTimer, gameStartTimer } = data;

    // CHECK FOR EXISTING SESSION
    if (SessionManager.getSession(sessionId)) {
      socket.emit('error', 'Session already exists.');
      return;
    }

    // CREATE NEW SESSION INSTANCE
    const session = SessionManager.createSession(sessionId, socket.id, hostUserName);

    // CLEANUP: RESET QUESTIONS ARRAY IN CASE OF ANY STALE STATE
    session.questions = [];

    // SET QUIZ ID SO IT CAN BE USED IN startSession()
    session.quizId = quizId;

    // SET ROUND TIMER DURATION (CONVERT SECONDS TO MILLISECONDS)
    session.roundTimer = roundTimer * 1000;

    // SET GAME START TIMER IN LOBBY (CONVERT SECONDS TO MILLISECONDS)
    session.gameStartTimer = gameStartTimer * 1000;

    // BEGIN GAME START TIMER COUNTDOWN
    if (!session.isStarted) {
      session.clearGameStartTimeout();

      session.currentGameStartTimeout = setTimeout(() => {
        this.startSession(socket, { sessionId }).then((response: any) => response);
      }, session.gameStartTimer);
    }

    // ADD HOST TO SOCKET ROOM
    socket.join(sessionId);

    // TODO: IS THIS NEEDED?
    // EMIT SESSION CREATION CONFIRMATION TO HOST
    socket.emit('session-created', {
      sessionId,
      hostUsername: session.hostUsername,
    });
  }

// JOIN EXISTING GAME SESSION
  public joinSession(socket: Socket, data: Player & GameSessionAttributes): void {
    // EXTRACT DATA FROM JOIN REQUEST
    let { id, sessionId, username } = data;

    // FIND ACTIVE/VALID SESSION
    const session = SessionManager.getSession(sessionId);

    // ASSIGN UUID TO UNREGISTERED PLAYERS
    if (!id) id = Math.floor(100 + Math.random() * 900);

    // VALIDATE SESSION
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    // CHECK IF USERNAME ALREADY EXISTS IN SESSION
    const nameExists = session.players.some((player: Player) => player.username === username);
    if (nameExists) {
      socket.emit('error', 'Player with this username already joined the game.');
      return;
    }

    // CREATE NEW PLAYER INSTANCE
    const player = new Player(id, socket.id, username);


    // ADD PLAYER TO SESSION AND JOIN SOCKET ROOM
    if (session.allPlayersAnswered()) player.hasAnswered = true;
    session.addPlayer(player);
    socket.join(sessionId);

    // BROADCAST UPDATED PLAYER LIST TO ALL CLIENTS
    this.io.to(sessionId).emit('player-joined', session.players);

    // RESET GAME START TIMER COUNTDOWN WHENEVER A NEW PLAYER JOINS
    session.clearGameStartTimeout();

    session.currentGameStartTimeout = setTimeout(() => {
      this.startSession(socket, { sessionId }).then((response: any) => response);
    }, session.gameStartTimer);

    socket.emit('game-start-timer', session.gameStartTimer);
    this.io.to(sessionId).emit('game-start-timer-reset', session.gameStartTimer);
  }

  // START GAME SESSION
  public async startSession(socket: Socket, { sessionId }: { sessionId: string }): Promise<void> {
    // FETCH SESSION BY ID
    const session = SessionManager.getSession(sessionId);
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    // GUARD AGAINST DUPLICATE TRIGGERS
    if (session.isStarted) return; // ALREADY STARTED — SKIP
    session.isStarted = true;

    // VALIDATE QUIZ ID EXISTS
    if (!session.quizId) {
      socket.emit('error', 'Quiz not set for this session.');
      return;
    }

    try {
      // GENERATE REDIS CACHE KEY
      const cacheKey: string = `quiz:${session.quizId}:questions`;

      // CACHE HIT: ATTEMPT TO RETRIEVE QUIZ QUESTIONS FROM REDIS
      const cached: string | null = await redis.get(cacheKey);

      // DECLARE/DEFINE QUESTIONS ARRAY
      let questions: QuestionAttributes[];

      if (cached) {
        // CACHE HIT: PARSE QUIZZES FROM REDIS
        console.log('Cache hit: Quiz questions...');
        questions = JSON.parse(cached);
      } else {
        // CACHE MISS: QUERY DATABASE FOR QUESTIONS IN SELECTED QUIZ
        // TODO: THIS SHOULD BE CALLED FROM THE QUESTION CONTROLLER
        // TODO: THE LOGIC ASSOCIATED CHECKING FOR A CACHE HIT/MISS SHOULD BE HANDLED BY THE QUESTION CONTROLLER
        console.log('Cache miss: Quiz questions...');

        // QUERY DATABASE FOR QUIZ QUESTIONS
        const result = await sequelize.query('EXECUTE GetQuestionsByQuizId :quizId', {
          replacements: { quizId: session.quizId },
        });

        // FORMAT RAW DATABASE QUESTION DATA
        questions = result[0].map((question: any) => ({
          ...question,
          options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
        }));

        // CACHE MISS CONTINUED — STORE FORMATTED QUESTIONS IN REDIS
        await redis.set(cacheKey, JSON.stringify(questions));
      }

      // ASSIGN QUESTIONS AND MARK SESSION AS STARTED
      session.questions = questions;
      session.isStarted = true;

      // NOTIFY ALL CLIENTS THAT SESSION STARTED
      this.io.to(sessionId).emit('session-started');

      // CLEAR GAME START TIMEOUT
      session.clearGameStartTimeout();

      // SEND FIRST QUESTION AND START TIMER
      const firstQuestion = questions[0];
      if (firstQuestion) {
        this.emitQuestionWithTimeout(session);
      }

    } catch (error: any) {
      console.error('Error starting session:', error);
      socket.emit('error', 'Failed to start quiz.');
    }
  }

  // CHECK FOR EXISTING SESSION
  public async checkSession(socket: Socket, data: { sessionId: string }): Promise<void> {
    const { sessionId } = data;

    // LOOK UP SESSION IN SESSION MANAGER
    const session = SessionManager.getSession(sessionId);

    // DETERMINE WHETHER THE SESSION HAS BEEN MARKED AS STARTED
    const isStarted = !!session?.isStarted;

    // SEND BOOLEAN RESPONSE BACK TO REQUESTING CLIENT
    socket.emit('check-session-response', isStarted);
  }

  // PLAYER LEAVES SESSION
  public leaveSession(socket: Socket): void {
    // LOCATE SESSION BY SOCKET ID
    const result = SessionManager.getSessionBySocketId(socket.id);
    if (!result) return;

    // REMOVE PLAYER AND BROADCAST UPDATED PLAYER LIST
    const [ sessionId, session ] = result;
    const removed = session.removePlayerBySocketId(socket.id);
    if (removed) {
      this.io.to(sessionId).emit('player-joined', session.players);
    }
  }

  // GET GAME START TIMER
  public getGameStartTimer(socket: Socket, { sessionId }: { sessionId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    socket.emit('game-start-timer', session.gameStartTimer);
  }

  // RETURN CURRENT QUESTION TO REQUESTING CLIENT
  public getCurrentQuestion(socket: Socket, { sessionId }: { sessionId: string }): void {
    // FETCH SESSION AND VALIDATE
    const session = SessionManager.getSession(sessionId);
    if (!session || !session.questions.length) {
      socket.emit('error', 'No current question found.');
      return;
    }

    // EMIT CURRENT QUESTION TO REQUESTING CLIENT
    const currentQuestion = session.questions[session.currentQuestionIndex];
    socket.emit('new-question', {
      question: currentQuestion,
      index: session.currentQuestionIndex,
      total: session.questions.length,
      roundTimer: session.roundTimer
    });
  }

  // HANDLE ADVANCEMENT TO NEXT QUESTION (CALLED BY FRONTEND AFTER LEADERBOARD)
  public handleNextQuestion({ sessionId }: { sessionId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    session.nextQuestion();

    // ADVANCE TO NEXT QUESTION OR END SESSION
    const next = session.questions[session.currentQuestionIndex];
    if (next) {
      this.emitQuestionWithTimeout(session);
    } else {
      this.io.to(session.sessionId).emit('session-ended');
      SessionManager.deleteSession(session.sessionId);
    }
  }

  // GET FULL PLAYER LIST FOR CLIENT THAT JOINED MIDWAY
  public getPlayers(socket: Socket, { sessionId }: { sessionId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    // SEND LATEST PLAYER LIST
    socket.emit('player-joined', session.players);
  }

  // HANDLE PLAYER ANSWER SUBMISSION
  public submitAnswer(socket: Socket, sessionData: any): void {
    // DESTRUCTURE SESSION DATA
    const { sessionId, answer, id } = sessionData;

    console.log(sessionData);

    // FETCH SESSION AND PLAYER OBJECT
    const session = SessionManager.getSession(sessionId);
    const player = session?.getPlayerBySocketId(socket.id);

    // PREVENT DUPLICATE OR INVALID SUBMISSIONS
    if (!player || player.hasAnswered) return;
    player.hasAnswered = true;

    // INCREMENT SCORE IF ANSWER IS CORRECT
    if (answer === session?.questions[session.currentQuestionIndex].correct) {
      session!.incrementScore(player.id);
      this.io.to(sessionId).emit('player-joined', session!.players);
    }

    // ADD PLAYER ANSWER TO PLAYERS ANSWERED LIST
    session?.playerAnswers.push(answer);

    // CHECK IF ALL PLAYERS HAVE ANSWERED
    if (session!.allPlayersAnswered()) {
      session!.clearRoundTimeout(); // CANCEL ANY ACTIVE TIMEOUT
      // NOTIFY CLIENTS THAT ROUND IS COMPLETE AND PROVIDE HOST ANSWERS
      this.io.to(sessionId).emit('all-players-answered', session?.playerAnswers);
    }
  }

  // HANDLE HOST SKIPPING QUESTION PHASE
  public handleSkipQuestion({ sessionId }: { sessionId: string }) {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    // CLEAR TIMER AND EMIT CURRENT ANSWERS
    session.clearRoundTimeout();
    this.io.to(sessionId).emit('all-players-answered', session.playerAnswers);
  }

  // HANDLE HOST LEAVING
  public handleHostLeft({ sessionId }: { sessionId: string }) {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    session.clearGameStartTimeout(); // IMPORTANT: CANCEL TIMER
    this.io.to(sessionId).emit('session-ended');
    SessionManager.deleteSession(sessionId);
  }

  // HOST-ONLY: EJECT SPECIFIC PLAYER FROM SESSION
  public handleEjectPlayer(socket: Socket, { id, sessionId }: { id : number, sessionId: string }): void {
    // FETCH SESSION
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

      // VALIDATE THAT SOCKET IS HOST
      if (socket.id !== session.hostSocketId) {
        socket.emit('error', 'Only the host can eject players.');
        return;
      }

      // FETCH PLAYER TO EJECT
      const player = session.getPlayerById(id);
      if (!player) return;

      // SEND EJECTION MESSAGE TO PLAYER
      this.io.to(player.socketId).emit('ejected-by-host');

      // REMOVE PLAYER FROM SESSION
      session.removePlayerByPlayerId(id);

    // BROADCAST UPDATED PLAYER LIST
    this.io.to(sessionId).emit('player-joined', session.players);
  }

  // HANDLE SOCKET DISCONNECT
  public handleDisconnect(socket: Socket): void {
    const result = SessionManager.getSessionBySocketId(socket.id);
    if (!result) return;

    const [ sessionId, session ] = result;

    // IF HOST DISCONNECTS, END SESSION FOR ALL
    if (session.hostSocketId === socket.id) {
      this.io.to(sessionId).emit('session-ended');
      SessionManager.deleteSession(sessionId);
    } else {
      // REMOVE PLAYER ON DISCONNECT AND UPDATE LIST
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

    // RESET ROUND STATE
    session.playerAnswers = []; // CLEAR PREVIOUS ANSWERS
    session.players.forEach((p) => (p.hasAnswered = false)); // RESET PLAYER FLAGS

    // EMIT NEW QUESTION TO ALL CLIENTS
    this.io.to(sessionId).emit('new-question', {
      question: currentQuestion,
      index: session.currentQuestionIndex,
      total: session.questions.length,
      roundTimer: session.roundTimer, // FOR TIMER DISPLAY ON CLIENT
    });

    // CLEAR ANY EXISTING TIMEOUT TO AVOID CONFLICTS
    session.clearRoundTimeout();

    // SET TIMEOUT TO FORCE PROGRESSION IF NOT ALL PLAYERS ANSWER IN TIME
    session.currentRoundTimeout = setTimeout(() => {
      if (!session.allPlayersAnswered() || !session.players.length) {
        // MARK ALL PLAYERS AS ANSWERED TO PREVENT FUTURE INPUT
        session.players.forEach((p) => (p.hasAnswered = true));

        // EMIT UPDATED PLAYER LIST (IN CASE HOST NEEDS TO SEE STATUS)
        this.io.to(sessionId).emit('player-joined', session.players);

        // EMIT WHATEVER ANSWERS HAVE BEEN RECEIVED (INCLUDING PARTIAL)
        this.io.to(sessionId).emit('all-players-answered', session.playerAnswers);
      }
    }, session.roundTimer);
  }
}
