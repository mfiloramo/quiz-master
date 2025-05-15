'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { useQuiz } from '@/contexts/QuizContext';
import { useAuth } from '@/contexts/AuthContext';
import { QuizQuestion } from '@/types/Quiz.types';
import QuizModule from '@/components/quiz-module/quiz-module';
import { motion } from 'framer-motion';
import { useSession } from '@/contexts/SessionContext';

export default function QuizPage() {
  const { currentIndex, setCurrentIndex, resetQuiz } = useQuiz();
  const { socket, disconnect } = useWebSocket();
  const { isHost } = useAuth();
  const router = useRouter();
  const { sessionId } = useSession();

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // LISTEN FOR HOST-EMITTED QUESTIONS
  useEffect((): any => {
    if (!socket) return;
    if (!sessionId) return <p>Loading session...</p>;

    socket.on('new-question', (data) => {
      console.log('new-question!');
      setCurrentQuestion(data.question);
      // setTotalQuestions(data.total);
    });

    socket.on('session-ended', () => {
      alert('Session has ended.');
      resetQuiz();
      router.push('/dashboard/library');
    });

    return () => {
      socket.off('new-question');
      socket.off('session-ended');
    };
  }, [socket, resetQuiz, router]);

  useEffect(() => {
    if (!socket) return;

    const timeout = setTimeout(() => {
      // Emit fallback in case new-question never arrived
      console.log('Fallback: requesting current question from server...');
      socket.emit('get-current-question', { sessionId });
    }, 500); // Wait a bit to allow any server-side emits first

    return () => clearTimeout(timeout);
  }, [socket, sessionId]);

  const handleAnswer = (answer: string) => {
    socket?.emit('submit-answer', {
      answer,
    });

    // TEMPORARY FEEDBACK: host should control next question
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleLeave = () => {
    disconnect();
    router.push('/dashboard');
  };

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
