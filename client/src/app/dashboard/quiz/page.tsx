'use client';

import { useEffect, useState, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import QuizModule from '@/components/quiz-module/quiz-module';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import { QuizQuestion } from '@/types/Quiz.types';
import { Player } from '@/interfaces/PlayerListProps.interface';
import { motion } from 'framer-motion';

const colorMap: string[] = ['bg-red-500', 'bg-blue-500', 'bg-yellow-400', 'bg-green-500'];

// DEFINE UI PHASE ENUM
enum QuizPhase {
  Question = 'QUESTION',
  AnswerSummary = 'ANSWER_SUMMARY',
  Leaderboard = 'LEADERBOARD',
}

export default function QuizPage(): JSX.Element {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [phase, setPhase] = useState<QuizPhase>(QuizPhase.Question);
  const [error, setError] = useState<string | null>(null);

  const { user, isHost, setIsHost } = useAuth();
  const { socket, disconnect } = useWebSocket();
  const { sessionId, clearSession, setPlayers } = useSession();
  const { currentIndex, setCurrentIndex, resetQuiz, setLockedIn } = useQuiz();
  const router = useRouter();

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
    if (!socket) return;

    socket.on(
      'new-question',
      (data: { index: number; question: QuizQuestion; total: number; roundTimer: number }) => {
        const { index, question, total, roundTimer } = data;
        setLockedIn(false);
        setCurrentIndex(index);
        setCurrentQuestion(question);
        setTotalQuestions(total);
        setPhase(QuizPhase.Question);
        setLoading(false);
        setSecondsLeft(roundTimer / 1000);
      }
    );

    socket.on('all-players-answered', () => {
      // SHOW ANSWER SUMMARY IMMEDIATELY AFTER ALL ANSWER
      setSecondsLeft(null);
      setLoading(true);
      setPhase(QuizPhase.AnswerSummary);
    });

    socket.on('player-joined', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard');
    });

    socket.on('session-ended', () => {
      alert('Session has ended.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard/');
    });

    return () => {
      socket.off('new-question');
      socket.off('player-joined');
      socket.off('session-ended');
      socket.off('ejected-by-host');
      socket.off('all-players-answered');
    };
  }, [socket, setPlayers, disconnect, resetQuiz, clearSession, router, setCurrentIndex, sessionId]);

  // PHASE-BASED PROGRESSION EFFECT
  // ADVANCES FROM ANSWER SUMMARY → LEADERBOARD → NEXT QUESTION (REQUESTED FROM BACKEND)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (phase === QuizPhase.AnswerSummary) {
      timer = setTimeout(() => setPhase(QuizPhase.Leaderboard), 5000);
    }

    if (phase === QuizPhase.Leaderboard) {
      timer = setTimeout(() => {
        setLoading(true);
        socket?.emit('next-question', { sessionId });
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, socket, sessionId]);

  // HANDLE ANSWER SUBMISSION
  const handleAnswer = (answer: string): void => {
    if (!user) return;
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

  // HANDLE USER LEAVING
  const handleLeave = (): void => {
    disconnect();
    resetQuiz();
    clearSession();
    if (isHost) setIsHost(false);
    router.push('/dashboard');
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      {/* RENDER QUIZ MODULE IF NOT HOST */}
      {phase === QuizPhase.Question && currentQuestion && !isHost && (
        <QuizModule
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onSubmit={handleAnswer}
        />
      )}

      {/* HOST ONLY: DISPLAY CURRENT ROUND QUESTION & CHOICES */}
      {phase === QuizPhase.Question && currentQuestion && isHost && (
        <div className='min-w-2xl my-8 max-w-2xl rounded-xl bg-slate-200 p-7 text-center text-5xl font-bold text-slate-900 shadow-xl'>
          <h2 className='mb-2 text-xl font-bold text-gray-700'>
            Question {currentIndex + 1} / {totalQuestions}
          </h2>
          <div className='mb-8 w-full rounded-lg bg-sky-100 p-6 text-center text-2xl font-bold text-black shadow-md'>
            <div>{currentQuestion.question}</div>
          </div>
          <div className='grid w-full grid-cols-2 gap-3'>
            {currentQuestion.options.map((option: string, index: number) => (
              <div
                key={index}
                className={`rounded-lg p-6 text-lg font-bold text-white shadow-md transition-all duration-200 ${colorMap[index % colorMap.length]}`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISPLAY TIMER (PLAYER ONLY) */}
      {phase === QuizPhase.Question && !isHost && secondsLeft !== null && (
        <div className='my-4 text-xl text-white'>Time Left: {secondsLeft}s</div>
      )}

      {/* DISPLAY ANSWER SUMMARY */}
      {phase === QuizPhase.AnswerSummary &&
        currentQuestion &&
        // <AnswerSummary question={currentQuestion} />
        'I am the answer summary'}

      {/* DISPLAY LEADERBOARD */}
      {phase === QuizPhase.Leaderboard && <Leaderboard />}

      {/* LEAVE/END GAME BUTTON */}
      <motion.button
        className='mt-12 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
        onClick={handleLeave}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.005 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isHost ? 'End Game' : 'Leave Game'}
      </motion.button>

      {/* ERROR MESSAGE */}
      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
