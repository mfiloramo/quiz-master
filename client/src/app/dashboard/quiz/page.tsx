'use client';

import { ReactElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuiz } from '@/contexts/QuizContext';
import { useWebSocket } from '@/contexts/WebSocketContext';
import QuizModule from '@/components/quiz-module/quiz-module';
import { QuizQuestion } from '@/types/Quiz.types';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';

export default function QuizPage(): ReactElement {
  // COMPONENT UTILITIES
  const { selectedQuiz, currentIndex, setCurrentIndex, resetQuiz } = useQuiz();
  const { socket, disconnect } = useWebSocket();
  const router = useRouter();

  // COMPONENT STATE
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // EFFECT HOOKS
  useEffect(() => {
    if (!selectedQuiz) {
      router.push('/dashboard/library');
    }
  }, [selectedQuiz, router]);

  // FETCH AND SET QUIZ QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!selectedQuiz) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3030/api/questions/quiz/${selectedQuiz.id}`);
        const data = await response.json();

        const formatted = data.map((q: any) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options,
        }));

        setQuestions(formatted);
        setQuizStarted(true);
      } catch (err) {
        setError('Failed to load quiz questions.');
      } finally {
        setLoading(false);
      }
    };

    router.push('/dashboard');

    fetchQuestions();
  }, [selectedQuiz]);

  // WEBSOCKET EVENT LISTENERS
  useEffect(() => {
    socket!.on('answer-received', (data) => {
      console.log('Answer received:', data);
    });

    socket!.on('session-ended', () => {
      alert('Session has ended.');
      resetQuiz();
      router.push('/dashboard/library');
    });

    socket!.on('player-disconnected', () => {
      console.log('Player has disconnected');
    });

    return () => {
      socket!.off('answer-received');
      socket!.off('session-ended');
    };
  }, [socket, resetQuiz, router]);

  // HANDLER FUNCTIONS
  const submitAnswer = async (selectedOption: string) => {
    await simulateLoad(750);
    const current = questions[currentIndex];
    if (!current) return;

    const isCorrect = selectedOption === current.correct;

    socket!.emit('submit-answer', {
      sessionId: 'your-session-id',
      playerId: socket!.id,
      isCorrect,
    });

    if (isCorrect) {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        alert('Quiz completed!');
        resetQuiz();
        router.push('/dashboard/library');
      }
    } else {
      setError('Incorrect answer, try again.');
      setTimeout(() => setError(null), 2000);
    }
  };

  // RATE LIMIT & SIMULATE LOAD TIME
  const simulateLoad = async (ms: number): Promise<void> => {
    setLoading(true);
    await new Promise((resolve: any) => setTimeout(resolve, ms));
    setLoading(false);
  };

  // HANDLE USER DISCONNECT
  const handleDisconnect = () => {
    socket!.emit('player-disconnected', { user: User });
    disconnect();
    router.push('/dashboard');
    console.log('handleDisconnect invoked...');
    // TODO: ADD TOAST MESSAGE
  };

  // RENDER PAGE
  return (
    <div className='flex flex-col items-center justify-center'>
      {selectedQuiz && (
        <div className='mb-4 text-2xl font-bold text-white'>{selectedQuiz.title}</div>
      )}

      {/* DISPLAY QUIZ MODULE */}
      {quizStarted && questions[currentIndex] && (
        <QuizModule
          question={questions[currentIndex]}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          onSubmit={submitAnswer}
        />
      )}

      {/* DISPLAY LOADING STATE */}
      {loading && <p className='mt-4 text-white'>Loading...</p>}

      {quizStarted && (
        <motion.button
          className='mt-12 h-16 w-40 rounded-lg bg-red-500 font-bold text-white transition hover:bg-red-400 active:bg-red-300'
          onClick={handleDisconnect}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.005 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          LEAVE GAME
        </motion.button>
      )}

      {/* DISPLAY ERROR */}
      {error && <p className='mt-4 text-red-200'>{error}</p>}
    </div>
  );
}
