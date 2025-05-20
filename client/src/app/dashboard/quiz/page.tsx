'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useSession } from '@/contexts/SessionContext';
import { QuizQuestion } from '@/types/Quiz.types';
import QuizModule from '@/components/quiz-module/quiz-module';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export default function QuizPage() {
  // STATE
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CUSTOM HOOKS
  const { currentIndex, setCurrentIndex, resetQuiz } = useQuiz();
  const { socket, disconnect } = useWebSocket();
  const { sessionId, clearSession } = useSession();
  const { user, isHost, setIsHost } = useAuth();
  const { lockedIn, setLockedIn } = useQuiz();
  const router = useRouter();

  // EMIT NEW QUESTION REQUEST
  useEffect(() => {
    if (!socket || !sessionId) return;
    socket.emit('get-current-question', { sessionId });
  }, [socket, sessionId]);

  // INITIALIZE SOCKET EVENT LISTENERS
  useEffect(() => {
    if (!socket) return;

    // RECEIVE NEW QUESTION
    socket.on('new-question', (data) => {
      setLockedIn(false);
      setCurrentIndex(data.index);
      setCurrentQuestion(data.question);
      setTotalQuestions(data.total);
      setLoading(false);
    });

    // TODO: ALERT() SOMETIMES COMES UP AFTER PLAYER LEAVES GAME, COMES BACK AND IS EJECTED AGAIN
    // PLAYER IS EJECTED BY HOST
    socket.on('ejected-by-host', () => {
      alert('You were removed from the session by the host.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard');
    });

    // GAME SESSION ENS
    socket.on('session-ended', () => {
      alert('Session has ended.');
      disconnect();
      resetQuiz();
      clearSession();
      router.push('/dashboard/library');
    });

    return () => {
      socket.off('new-question');
      socket.off('session-ended');
      socket.off('ejected-by-host');
    };
  }, [socket, resetQuiz, router, disconnect, clearSession]);

  // GET CURRENT QUESTION
  useEffect(() => {
    if (!socket || !sessionId) return;

    const timeout = setTimeout(() => {
      socket.emit('get-current-question', { sessionId });
    }, 500);

    return () => clearTimeout(timeout);
  }, [socket, sessionId]);

  // HANDLER FUNCTIONS
  const handleAnswer = (answer: string): void => {
    socket?.emit('submit-answer', {
      sessionId,
      id: user!.id,
      answer,
    });
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
    if (isHost) {
      socket?.emit('get-current-question', { sessionId });
    }
  };

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
      {currentQuestion ? (
        <QuizModule
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={totalQuestions}
          onSubmit={handleAnswer}
        />
      ) : (
        <div className='text-white'>Waiting for host to start the quiz...</div>
      )}

      {loading && <p className='mt-4 text-black'>Waiting for next question...</p>}

      <motion.button
        className='mt-12 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
        onClick={handleLeave}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.005 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Leave Game
      </motion.button>

      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
