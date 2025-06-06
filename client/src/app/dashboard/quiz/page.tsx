'use client';

import { JSX, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import QuizModule from '@/components/quiz-module/quiz-module';
import Leaderboard from '@/components/leaderboard/leaderboard';
import HostQuestionDisplay from '@/components/host-question-display/host-question-display';
import { QuizPhase } from '@/enums/QuizPhase.enum';
import { QuizQuestion, QuizSession } from '@/types/Quiz.types';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { motion } from 'framer-motion';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import PlayerAnswerSummary from '@/components/player-answer-summary/player-answer-summary';
import PlayerAnswersGraph from '@/components/player-answers-graph/player-answers-graph';
import FinalScoreboard from '@/components/final-scoreboard/final-scoreboard';

// PAGE CONSTANTS
const colorMap: string[] = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];

export default function QuizPage(): JSX.Element {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [roundTimerSetting, setRoundTimerSetting] = useState<number | null>(null);
  const [phase, setPhase] = useState<QuizPhase>(QuizPhase.Question);
  const [error, setError] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [playerAnswers, setPlayerAnswers] = useState<string[]>([]);

  // CUSTOM HOOKS/CONTEXTS
  const router = useRouter();
  const { user, isHost, setIsHost } = useAuth();
  const { socket, disconnect } = useWebSocket();
  const { sessionId, clearSession, players, setPlayers } = useSession();
  const { currentIndex, setCurrentIndex, resetQuiz, setLockedIn } = useQuiz();

  // ON MOUNT, REQUEST CURRENT QUESTION
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-current-question', { sessionId });
  }, [socket, sessionId]);

  // ON MOUNT, REQUEST PLAYER LIST
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-players', { sessionId });
  }, [socket, sessionId]);

  // TIMER COUNTDOWN DURING QUESTION PHASE
  useEffect(() => {
    if (!loading && secondsLeft !== null) {
      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev !== null && prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [loading, secondsLeft]);

  // HANDLE SOCKET EVENTS
  useEffect(() => {
    // VALIDATE SOCKET
    if (!socket) return;

    // NEW QUESTION EMITTED FROM SERVER
    socket.on('new-question', (data: QuizSession) => {
      const { index, question, total, roundTimer } = data;
      setLockedIn(false);
      setCurrentIndex(index);
      setCurrentQuestion(question);
      setRoundTimerSetting(roundTimer / 1000);
      setTotalQuestions(total);
      setPhase(QuizPhase.Question);
      setLoading(false);
      setSecondsLeft(roundTimer / 1000);
      setUserAnswer(null); // RESET USER ANSWER ON NEW QUESTION
    });

    // ALL PLAYERS ANSWERED
    socket.on('all-players-answered', (answers: string[] | undefined): void => {
      setSecondsLeft(null);
      setLoading(true);
      setPhase(QuizPhase.AnswerSummary);

      if (Array.isArray(answers)) {
        setPlayerAnswers(answers);
      } else {
        console.warn('Received undefined or invalid player answers from server:', answers);
        setPlayerAnswers([]);
      }
    });

    // PLAYER JOINED SESSION
    socket.on('player-joined', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    // PLAYER EJECTED FROM SESSION BY HOST
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard');
    });

    // SESSION ENDED
    socket.on('session-ended', () => {
      // SHOW FINAL SCOREBOARD
      setPhase(QuizPhase.FinalScoreboard);

      // END SESSION AFTER TIMEOUT
      setTimeout(() => {
        alert('Session has ended.');
        disconnect();
        resetQuiz();
        clearSession();
        if (isHost) router.push('/dashboard/library');
        else router.push('/dashboard/join');
      }, 8000);
    });

    // CLEANUP SOCKET LISTENERS
    return () => {
      socket.off('new-question');
      socket.off('player-joined');
      socket.off('session-ended');
      socket.off('ejected-by-host');
      socket.off('all-players-answered');
    };
  }, [socket, setPlayers, disconnect, resetQuiz, clearSession, router, setCurrentIndex, sessionId]);

  // PHASE-BASED PROGRESSION ENGINE
  useEffect(() => {
    // INITIALIZE NEW TIMER
    let timer: NodeJS.Timeout | null | number = null;

    // PHASE: ANSWER SUMMARY -> LEADERBOARD
    if (phase === QuizPhase.AnswerSummary) {
      timer = setTimeout(() => setPhase(QuizPhase.Leaderboard), 1000);
    }

    // PHASE: LEADERBOARD -> NEXT QUESTION / FINAL SCORES
    if (phase === QuizPhase.Leaderboard) {
      timer = setTimeout(() => {
        setLoading(true);

        // ADVANCE TO NEXT QUESTION IF QUIZ STILL HAS QUESTIONS
        if (isHost) {
          socket?.emit('next-question', { sessionId });
        }
      }, 1000);
    }

    // CLEAR TIMER ON CLEANUP
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, socket, sessionId]);

  // HANDLE USER ANSWER
  const handleAnswer = (answer: string): void => {
    if (!user) return;
    setUserAnswer(answer);
    setPlayerAnswers((previousAnswers: string[]) => [...previousAnswers, answer]);
    socket?.emit('submit-answer', {
      sessionId,
      id: user.id,
      answer,
    });
    setLoading(true);
    if (isHost) {
      socket?.emit('get-current-question', { sessionId });
    }
  };

  // HANDLE LEAVING SESSION
  const handleLeave = (): void => {
    disconnect();
    resetQuiz();
    clearSession();
    if (isHost) setIsHost(false);
    router.push('/dashboard');
  };

  // MAIN RENDER
  return (
    // MAIN CONTAINER
    <div className='flex flex-col items-center justify-center'>
      {/* TODO: EXTRACT VIEW PHASE ENGINE AS COMPONENT*/}
      {/* PLAYER QUESTION VIEW */}
      {phase === QuizPhase.Question && currentQuestion && !isHost && (
        <QuizModule
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onSubmit={handleAnswer}
        />
      )}

      {/* PLAYER TIMER DISPLAY */}
      {phase === QuizPhase.Question && !isHost && secondsLeft !== null && (
        <div className={'mt-8'}>
          <CountdownCircleTimer
            isPlaying
            duration={roundTimerSetting!}
            colors={['#3b8600', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[7, 5, 2, 0]}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
        </div>
      )}

      {/* HOST QUESTION VIEW */}
      {phase === QuizPhase.Question && currentQuestion && isHost && (
        <HostQuestionDisplay
          question={currentQuestion.question}
          options={currentQuestion.options}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          colorMap={colorMap}
        />
      )}

      {/* HOST ANSWER SUMMARY VIEW */}
      {phase === QuizPhase.AnswerSummary && currentQuestion && isHost && (
        <>
          <PlayerAnswersGraph playerAnswers={playerAnswers} options={currentQuestion.options} />
          <HostQuestionDisplay
            question={currentQuestion.question}
            options={currentQuestion.options}
            correctAnswer={currentQuestion.correct}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            colorMap={colorMap}
          />
        </>
      )}

      {/* PLAYER ANSWER SUMMARY */}
      {phase === QuizPhase.AnswerSummary && currentQuestion && !isHost && (
        <div className='min-w-2xl my-8 rounded-xl bg-white p-6 text-center text-2xl font-medium text-gray-900 shadow-md'>
          {userAnswer ? (
            <PlayerAnswerSummary userAnswer={userAnswer} correctAnswer={currentQuestion.correct} />
          ) : (
            <p>Time is up!</p>
          )}
        </div>
      )}

      {/* LEADERBOARD DISPLAY */}
      {phase === QuizPhase.Leaderboard && <Leaderboard />}

      {/* FINAL SCOREBOARD (HOST DISPLAY) */}
      {phase === QuizPhase.FinalScoreboard && isHost && <FinalScoreboard />}

      {/* LEAVE/END BUTTON */}
      <motion.button
        className='mt-7 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
        onClick={handleLeave}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.005 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isHost ? 'End Game' : 'Leave Game'}
      </motion.button>

      {/* ERROR DISPLAY */}
      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
