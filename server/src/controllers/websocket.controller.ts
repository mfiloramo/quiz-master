import { Socket, Server } from 'socket.io';
import { GameSessionAttributes } from '../interfaces/GameSessionAttributes.interface';
import { QuestionAttributes } from '../interfaces/QuestionAttributes.interface';
import { SessionManager } from '../utils/SessionManager';
import { Player } from '../utils/Player';
import { sequelize } from '../config/sequelize';


export class WebSocketController {
  constructor(private io: Server) {}

  // CREATE NEW GAME SESSION
  public createSession(socket: Socket, data: GameSessionAttributes): void {
    // DESTRUCTURE SESSION DATA
    const { sessionId, hostUserName, quizId } = data;

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

    // JOIN GAME SESSION
    socket.join(sessionId);

    // EMIT SESSION DATA
    socket.emit('session-created', {
      sessionId,
      hostUsername: session.hostUsername,
    });
  }

  // JOIN EXISTING GAME SESSION
  public joinSession(socket: Socket, data: GameSessionAttributes): void {
    const { sessionId, playerId, username } = data;
    const session = SessionManager.getSession(sessionId);

    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    // ENABLE IN PROD
    // const nameExists = session.players.some((player: Player) => player.username === username);
    // if (nameExists) {
    //   socket.emit('error', 'Player with this username already joined the game.');
    //   return;
    // }

    const player = new Player(playerId!, username!, socket.id);
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
  public async startSession(socket: Socket, { sessionId }: { sessionId: string }): Promise<void>
  {
    // GET REQUESTED SESSION
    const session = SessionManager.getSession(sessionId);

    // CHECK FOR EXISTING SESSION
    if (!session) {
      socket.emit('error', 'Session not found.');
      return;
    }

    // CHECK IF QUIZ ID IS PROVIDED
    if (!session.quizId) {
      socket.emit('error', 'Quiz not set for this session.');
      return;
    }

    // QUERY DATABASE FOR ALL QUESTIONS IN SELECTED QUIZ
    try {
      const result = await sequelize.query('EXECUTE GetQuestionsByQuizId :quizId', {
        replacements: { quizId: session.quizId },
      });

      // FORMAT DATABASE OUTPUT
      const formattedQuestions: QuestionAttributes[] = result[0].map((question: any) => ({
        ...question,
        options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
      }));

      // ADD QUESTIONS AND isStarted TO SESSION
      session.questions = formattedQuestions;
      session.isStarted = true;

      // BROADCAST SESSION STARTED TO ALL CLIENTS
      this.io.to(sessionId).emit('session-started');

      // EMIT FIRST QUIZ QUESTION
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

  // RETURN CURRENT QUESTION TO REQUESTING PLAYER
  public getCurrentQuestion(socket: Socket, { sessionId }: { sessionId: string }): void {
    const session = SessionManager.getSession(sessionId);

    try {
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
    } catch (error: any) {
      console.error(`Server error in websocket.controller at getCurrentQuestion: ${error}`)
    } finally {
      session!.nextQuestion();
    }
  }

  // HANDLE PLAYER ANSWER SUBMISSION
  public submitAnswer(socket: Socket, sessionData: any, answer: any): void {

    console.log(sessionData, answer);

    // FETCH GAME SESSION
    const session = SessionManager.getSession(sessionData.sessionId);
    const { questions, currentQuestionIndex } = sessionData;

    // MAKE SURE SESSION IS VALID
    if (!session) return;

    // CHECK IF ANSWER IS CORRECT
    if (answer === session.questions[currentQuestionIndex].correct) {
      session.incrementScore(sessionData.id)
    }
  }

  // HOST-ONLY: EJECT SPECIFIC PLAYER
  public handleEjectPlayer(socket: Socket, { sessionId, playerId }: { sessionId: string; playerId: string }): void {
    const session = SessionManager.getSession(sessionId);
    if (!session) return;

    if (socket.id !== session.hostSocketId) {
      socket.emit('error', 'Only the host can eject players.');
      return;
    }

    const player = session.getPlayer(playerId);
    if (!player) return;

    // SEND EJECTION TO PLAYER
    this.io.to(player.socketId).emit('ejected-by-host');

    // REMOVE FROM SESSION
    session.removePlayerByPlayerId(playerId);

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
}
